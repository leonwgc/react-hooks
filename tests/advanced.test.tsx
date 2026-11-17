import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { memo, useRef, useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import {
  useRequest,
  useForm,
  useFormField,
  useTable,
  useVirtualList,
  useKeyPress,
  useSortable,
  type FormControl,
} from "../src";
afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});
it("retries with backoff and stops retry timers on cancel", async () => {
  vi.useFakeTimers();
  const service = vi
    .fn()
    .mockRejectedValueOnce(new Error("network"))
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValue("ok");
  const { result } = renderHook(() =>
    useRequest(service, { retry: 2, retryDelay: (n) => n * 100 }),
  );
  let promise!: Promise<unknown>;
  act(() => {
    promise = result.current.runAsync();
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(99);
  });
  expect(service).toHaveBeenCalledTimes(1);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(101);
  });
  expect(service).toHaveBeenCalledTimes(2);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
    await promise;
  });
  expect(result.current.data).toBe("ok");
  expect(result.current.retryCount).toBe(2);
  service.mockRejectedValue(new Error("again"));
  act(() => {
    promise = result.current.runAsync().catch((error) => error);
  });
  await act(async () => {});
  act(() => result.current.cancel());
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000);
  });
  expect(service).toHaveBeenCalledTimes(4);
  expect(await promise).toMatchObject({ name: "AbortError" });
});
it("times out uncooperative transports and respects retry predicates", async () => {
  vi.useFakeTimers();
  let signal!: AbortSignal;
  const service = vi.fn(({ signal: current }: { signal: AbortSignal }) => {
    signal = current;
    return new Promise<string>(() => {});
  });
  const { result } = renderHook(() =>
    useRequest(service, { timeout: 50, retry: 2, shouldRetry: () => false }),
  );
  let promise!: Promise<unknown>;
  act(() => {
    promise = result.current.runAsync().catch((error) => error);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });
  expect(await promise).toMatchObject({ name: "TimeoutError" });
  expect(signal.aborted).toBe(true);
  expect(result.current.loading).toBe(false);
  expect(service).toHaveBeenCalledOnce();
});
it("refreshes on focus and reconnect with throttling and pauses hidden polling", async () => {
  vi.useFakeTimers();
  let hidden = false;
  vi.spyOn(document, "visibilityState", "get").mockImplementation(() =>
    hidden ? "hidden" : "visible",
  );
  const service = vi.fn(async () => 1);
  const { result } = renderHook(() =>
    useRequest(service, {
      manual: false,
      defaultParams: [],
      refreshOnFocus: true,
      refreshOnReconnect: true,
      refreshThrottleInterval: 1000,
      pollingInterval: 100,
      pollingWhenHidden: false,
    }),
  );
  await act(async () => {});
  expect(service).toHaveBeenCalledOnce();
  await act(async () => {
    window.dispatchEvent(new Event("focus"));
  });
  expect(service).toHaveBeenCalledTimes(2);
  await act(async () => {
    window.dispatchEvent(new Event("online"));
  });
  expect(service).toHaveBeenCalledTimes(2);
  act(() => {
    hidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(service).toHaveBeenCalledTimes(2);
  act(() => result.current.cancel());
  await act(async () => {
    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(1500);
  });
  expect(service).toHaveBeenCalledTimes(2);
});
it("debounces change validation, validates dependent fields and ignores old validations", async () => {
  vi.useFakeTimers();
  const check = vi.fn(async (value: string) =>
    value.length < 3 ? "short" : undefined,
  );
  const { result } = renderHook(() =>
    useForm({
      initialValues: { name: "", password: "", confirm: "" },
      mode: "onChange",
      validateDebounce: 100,
      dependencies: { confirm: ["password"] },
      validators: {
        name: check,
        confirm: (value, values) =>
          value !== values.password ? "mismatch" : undefined,
      },
    }),
  );
  act(() => {
    result.current.setFieldValue("name", "a");
    result.current.setFieldValue("name", "abc");
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(check).toHaveBeenCalledTimes(1);
  expect(result.current.errors.name).toBeUndefined();
  act(() => result.current.setFieldValue("password", "secret"));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(result.current.errors.confirm).toBe("mismatch");
  act(() => {
    result.current.setFieldValue("name", "a");
    result.current.reset();
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(200);
  });
  expect(result.current.errors).toEqual({});
});
it("retains every changed field within a shared validation debounce window", async () => {
  vi.useFakeTimers();
  const { result } = renderHook(() =>
    useForm({
      initialValues: { first: "", second: "" },
      mode: "onChange",
      validateDebounce: 100,
      dependencies: {},
      validators: {
        first: (value) => (value.length < 3 ? "first too short" : undefined),
        second: (value) => (value.length < 3 ? "second too short" : undefined),
      },
    }),
  );
  act(() => {
    result.current.setFieldValue("first", "a");
    result.current.setFieldValue("second", "b");
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(result.current.errors).toEqual({
    first: "first too short",
    second: "second too short",
  });
});
it("supports blur validation and schema adapters, including adapter failures", async () => {
  const { result } = renderHook(() =>
    useForm({
      initialValues: { name: "" },
      mode: "onBlur",
      schema: async (values) => (values.name ? {} : { name: "required" }),
    }),
  );
  await act(async () => {
    result.current.register("name").onBlur();
  });
  expect(result.current.errors.name).toBe("required");
  const failed = renderHook(() =>
    useForm({
      initialValues: {},
      schema: async () => {
        throw new Error("schema unavailable");
      },
    }),
  );
  let valid = true;
  await act(async () => {
    valid = await failed.result.current.validate();
  });
  expect(valid).toBe(false);
  expect(failed.result.current.submitError).toMatchObject({
    message: "schema unavailable",
  });
});
it("validates nested fields when selecting their parent and clears recovered errors", async () => {
  const { result } = renderHook(() =>
    useForm({
      initialValues: { profile: { name: "" }, other: "" },
      validators: {
        "profile.name": (value) => (value ? undefined : "required"),
        other: (value) => (value ? undefined : "unrelated"),
      },
    }),
  );
  await act(async () => {
    await result.current.validate();
  });
  expect(result.current.errors).toEqual({
    "profile.name": "required",
    other: "unrelated",
  });
  act(() => result.current.setFieldValue("profile", { name: "updated" }));
  await act(async () => {
    await result.current.validate(["profile"]);
  });
  expect(result.current.errors).toEqual({ other: "unrelated" });
});
it("field subscriptions keep unrelated memoized fields from rerendering", () => {
  type Values = { first: string; second: string };
  const renders = { first: 0, second: 0 };
  const Field = memo(function Field({
    control,
    name,
  }: {
    control: FormControl<Values>;
    name: keyof Values;
  }) {
    const field = useFormField(control, name);
    renders[name]++;
    return (
      <input
        aria-label={name}
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    );
  });
  function Demo() {
    const form = useForm({ initialValues: { first: "", second: "" } });
    return (
      <>
        <Field control={form.control} name="first" />
        <Field control={form.control} name="second" />
      </>
    );
  }
  render(<Demo />);
  const before = renders.second;
  fireEvent.change(screen.getByLabelText("first"), {
    target: { value: "updated" },
  });
  expect(renders.second).toBe(before);
  expect(screen.getByLabelText("first")).toHaveProperty("value", "updated");
});
it("hydrates table URL state, preserves unrelated params and stores column choices", async () => {
  const serialized = JSON.stringify({
    page: 2,
    pageSize: 5,
    filters: { q: "hello" },
    sort: null,
  });
  window.history.replaceState(
    { keep: true },
    "",
    `/?other=ok&table=${encodeURIComponent(serialized)}#/table`,
  );
  const service = vi.fn(async () => ({ list: ["row"], total: 50 }));
  const parseFilters = (value: unknown) => {
    if (
      !value ||
      typeof value !== "object" ||
      !("q" in value) ||
      typeof value.q !== "string"
    )
      throw new Error("invalid");
    return { q: value.q };
  };
  const { result } = renderHook(() =>
    useTable(service, {
      initialFilters: { q: "" },
      pageSize: 5,
      select: (value) => value,
      urlState: { key: "table", parseFilters },
      columns: ["a", "b"],
      columnsStorageKey: "cols",
      filterPresets: { saved: { q: "preset" } },
    }),
  );
  await waitFor(() => expect(result.current.page).toBe(2));
  expect(service.mock.calls[0]?.length).toBeGreaterThan(0);
  expect(result.current.search.submitted.q).toBe("hello");
  act(() => result.current.setPage(3));
  await waitFor(() =>
    expect(
      JSON.parse(new URLSearchParams(location.search).get("table")!).page,
    ).toBe(3),
  );
  expect(location.hash).toBe("#/table");
  expect(new URLSearchParams(location.search).get("other")).toBe("ok");
  expect(history.state).toEqual({ keep: true });
  act(() => {
    result.current.columns.setVisible("b", false);
    result.current.columns.setOrder(["b", "a"]);
  });
  expect(result.current.columns.visible).toEqual(["a"]);
  expect(JSON.parse(localStorage.getItem("cols")!).order).toEqual(["b", "a"]);
  act(() => result.current.applyPreset("saved"));
  expect(result.current.search.submitted.q).toBe("preset");
  expect(result.current.page).toBe(1);
  act(() => {
    history.replaceState(
      {},
      "",
      `/?other=ok&table=${encodeURIComponent(serialized)}#/table`,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(result.current.page).toBe(2);
  expect(result.current.search.submitted.q).toBe("hello");
});
it("preserves virtual scroll anchors when records are prepended", () => {
  const initial = Array.from({ length: 100 }, (_, id) => ({ id }));
  let list!: ReturnType<typeof useVirtualList<{ id: number }>>;
  let prepend!: () => void;
  function Demo() {
    const [items, setItems] = useState(initial);
    list = useVirtualList(items, {
      itemHeight: 20,
      height: 100,
      getKey: (item) => item.id,
    });
    prepend = () =>
      setItems((previous) => [{ id: -1 }, { id: -2 }, ...previous]);
    return (
      <div
        ref={list.containerRef}
        onScroll={list.onScroll}
        style={list.containerStyle}
      />
    );
  }
  render(<Demo />);
  act(() => list.scrollTo(50));
  expect(list.containerRef.current?.scrollTop).toBe(1000);
  act(prepend);
  expect(list.containerRef.current?.scrollTop).toBe(1040);
});
it("measures dynamic row sizes and updates total height", () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const height = this.dataset.row ? 50 : 100;
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 200,
        bottom: height,
        width: 200,
        height,
        toJSON() {
          return {};
        },
      };
    },
  );
  let list!: ReturnType<typeof useVirtualList<number>>;
  const items = [0, 1, 2];
  function Demo() {
    list = useVirtualList(items, {
      itemHeight: 20,
      height: 100,
      dynamic: true,
      getKey: (value) => value,
    });
    return (
      <div ref={list.containerRef}>
        {list.virtualItems.map((row) => (
          <div
            key={row.key}
            ref={row.measureRef}
            data-row="true"
            style={row.style}
          >
            {row.item}
          </div>
        ))}
      </div>
    );
  }
  render(<Demo />);
  expect(list.totalHeight).toBe(150);
  expect(list.virtualItems[0]?.style.height).toBeUndefined();
});
it("combination shortcuts respect scopes and exclusive priority", () => {
  const low = vi.fn(),
    high = vi.fn();
  function Demo() {
    const scope = useRef<HTMLDivElement>(null);
    useKeyPress("mod+k", low, { platform: "windows", preventDefault: true });
    useKeyPress("ctrl+k", high, { scope, priority: 10, preventDefault: true });
    return (
      <div ref={scope}>
        <button>inside</button>
      </div>
    );
  }
  render(<Demo />);
  fireEvent.keyDown(screen.getByText("inside"), { key: "k", ctrlKey: true });
  expect(high).toHaveBeenCalledOnce();
  expect(low).not.toHaveBeenCalled();
  fireEvent.keyDown(window, { key: "k", ctrlKey: true });
  expect(low).toHaveBeenCalledOnce();
  fireEvent.keyDown(window, { key: "k", ctrlKey: true, shiftKey: true });
  expect(low).toHaveBeenCalledTimes(1);
});
it("preserves literal plus keys and supports the plus alias in chords", () => {
  const literal = vi.fn(),
    chord = vi.fn();
  renderHook(() => {
    useKeyPress("+", literal);
    useKeyPress("ctrl+shift+plus", chord, { priority: 1 });
  });
  fireEvent.keyDown(window, { key: "+", shiftKey: true });
  expect(literal).toHaveBeenCalledOnce();
  expect(chord).not.toHaveBeenCalled();
  fireEvent.keyDown(window, { key: "+", ctrlKey: true, shiftKey: true });
  expect(chord).toHaveBeenCalledOnce();
});
it("keyboard sorting moves, cancels and commits while retaining focus", () => {
  function Demo() {
    const [items, setItems] = useState(["a", "b", "c"]);
    const sort = useSortable(items, {
      getKey: (value) => value,
      onChange: setItems,
    });
    return (
      <>
        <div>
          {items.map((item) => (
            <div key={item} {...sort.getItemProps(item)}>
              {item}
            </div>
          ))}
        </div>
        <output>{items.join(",")}</output>
      </>
    );
  }
  render(<Demo />);
  const a = screen.getByText("a");
  fireEvent.keyDown(a, { key: " " });
  fireEvent.keyDown(a, { key: "ArrowDown" });
  expect(screen.getByText("b,a,c")).toBeTruthy();
  fireEvent.keyDown(a, { key: "Escape" });
  expect(screen.getByText("a,b,c")).toBeTruthy();
  fireEvent.keyDown(a, { key: " " });
  fireEvent.keyDown(a, { key: "End" });
  fireEvent.keyDown(a, { key: "Enter" });
  expect(screen.getByText("b,c,a")).toBeTruthy();
});
