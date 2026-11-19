import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  createQueryStore,
  useAsyncQueue,
  useDrag,
  useForm,
  useFullscreen,
  useImage,
  useInfiniteScroll,
  useLongPress,
  usePagination,
  useQuery,
  useRequest,
  useSelection,
  useSortable,
  useTable,
  useTextareaAutoSize,
  useTextSelection,
  useTransitionState,
  useUpload,
} from "../src";
import { getPath, setPath, unsetPath } from "../src/form/path";

describe("form", () => {
  const required = (value: string) => (value ? undefined : "required");
  it("validates only the blurred field in onBlur mode", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "", b: "" },
        mode: "onBlur",
        validators: { a: required, b: required },
      }),
    );
    act(() => result.current.register("a").onBlur());
    await waitFor(() => expect(result.current.errors).toEqual({ a: "required" }));
  });
  it("validates only the changed field in onChange mode and keeps other errors", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "x", b: "" },
        mode: "onChange",
        validators: { a: required, b: required },
      }),
    );
    act(() => result.current.setFieldError("b", "server"));
    act(() => result.current.setFieldValue("a", ""));
    await waitFor(() =>
      expect(result.current.errors).toEqual({ a: "required", b: "server" }),
    );
  });
  it("scopes schema errors to the changed field", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "x", b: "" },
        mode: "onChange",
        schema: (values) => ({
          ...(values.a ? {} : { a: "required" }),
          ...(values.b ? {} : { b: "required" }),
        }),
      }),
    );
    act(() => result.current.setFieldValue("a", ""));
    await waitFor(() => expect(result.current.errors).toEqual({ a: "required" }));
    await act(async () => {
      expect(await result.current.validate()).toBe(false);
    });
    expect(result.current.errors).toEqual({ a: "required", b: "required" });
  });
  it("registers radio groups, checkbox groups, multi-selects and file inputs", () => {
    const file = new File(["x"], "a.txt");
    let values!: {
      color: string;
      tags: string[];
      multi: string[];
      files: File[];
    };
    function Demo() {
      const form = useForm({
        initialValues: {
          color: "red",
          tags: ["a"],
          multi: [] as string[],
          files: [] as File[],
        },
      });
      values = form.values;
      return (
        <>
          <input type="radio" aria-label="red" {...form.register("color", { value: "red" })} />
          <input type="radio" aria-label="blue" {...form.register("color", { value: "blue" })} />
          <input type="checkbox" aria-label="tag a" {...form.register("tags", { value: "a" })} />
          <input type="checkbox" aria-label="tag b" {...form.register("tags", { value: "b" })} />
          <select multiple aria-label="multi" {...form.register("multi")}>
            <option value="x">x</option>
            <option value="y">y</option>
          </select>
          <input type="file" aria-label="files" {...form.register("files", { type: "file" })} />
        </>
      );
    }
    render(<Demo />);
    const red = screen.getByLabelText("red") as HTMLInputElement;
    const blue = screen.getByLabelText("blue") as HTMLInputElement;
    expect(red.checked).toBe(true);
    fireEvent.click(blue);
    expect(values.color).toBe("blue");
    expect(blue.checked).toBe(true);
    expect(red.checked).toBe(false);
    fireEvent.click(screen.getByLabelText("tag b"));
    expect(values.tags).toEqual(["a", "b"]);
    fireEvent.click(screen.getByLabelText("tag a"));
    expect(values.tags).toEqual(["b"]);
    const select = screen.getByLabelText("multi") as HTMLSelectElement;
    select.options[0]!.selected = true;
    select.options[1]!.selected = true;
    fireEvent.change(select);
    expect(values.multi).toEqual(["x", "y"]);
    fireEvent.change(screen.getByLabelText("files"), {
      target: { files: [file] },
    });
    expect(values.files).toEqual([file]);
  });
});

describe("path helpers", () => {
  it("removes array elements without leaving holes", () => {
    const next = unsetPath({ list: [1, 2, 3] }, "list.1");
    expect(next.list).toEqual([1, 3]);
    expect(Object.keys(next.list)).toEqual(["0", "1"]);
  });
  it("preserves prototypes, ignores inherited members and allows constructor keys", () => {
    class Point {
      constructor(public x = 0) {}
    }
    const next = setPath({ point: new Point(1) }, "point.x", 2);
    expect(next.point).toBeInstanceOf(Point);
    expect(next.point.x).toBe(2);
    expect(getPath({}, "constructor")).toBeUndefined();
    expect(getPath({ toString: "own" }, "toString")).toBe("own");
    const withKey = setPath({} as { constructor?: string }, "constructor", "c");
    expect(Object.prototype.hasOwnProperty.call(withKey, "constructor")).toBe(true);
    expect(Object.getPrototypeOf(withKey)).toBe(Object.prototype);
    expect(() => setPath({}, "__proto__.polluted", 1)).toThrow();
  });
});

describe("selection and pagination", () => {
  it("toggleAll clears a selection capped by maxSelected", () => {
    const { result } = renderHook(() =>
      useSelection([1, 2, 3], { maxSelected: 2 }),
    );
    act(() => result.current.toggleAll());
    expect(result.current.selectedKeys).toEqual([1, 2]);
    expect(result.current.allSelected).toBe(true);
    expect(result.current.partiallySelected).toBe(false);
    act(() => result.current.toggleAll());
    expect(result.current.selectedKeys).toEqual([]);
  });
  it("next/previous use the latest page when called repeatedly before render", () => {
    const { result } = renderHook(() => usePagination({ total: 100 }));
    act(() => {
      result.current.next();
      result.current.next();
    });
    expect(result.current.page).toBe(3);
    act(() => {
      result.current.previous();
      result.current.previous();
      result.current.previous();
    });
    expect(result.current.page).toBe(1);
    act(() => {
      for (let i = 0; i < 20; i++) result.current.next();
    });
    expect(result.current.page).toBe(10);
  });
});

describe("pointer and drag", () => {
  it("long press exposes currentTarget and suppresses the following click", () => {
    vi.useFakeTimers();
    vi.stubGlobal("PointerEvent", MouseEvent);
    let target: unknown;
    const click = vi.fn();
    function Demo() {
      const press = useLongPress((event) => (target = event.currentTarget));
      return (
        <button {...press.bind} onClick={click}>
          hold
        </button>
      );
    }
    render(<Demo />);
    const button = screen.getByText("hold");
    fireEvent.pointerDown(button, { button: 0 });
    act(() => vi.advanceTimersByTime(600));
    expect(target).toBe(button);
    fireEvent.pointerUp(button);
    fireEvent.click(button);
    expect(click).not.toHaveBeenCalled();
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerUp(button);
    fireEvent.click(button);
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("useDrag recovers when the drag source disappears before dragend", () => {
    const { result } = renderHook(() => useDrag("payload"));
    act(() =>
      result.current.bind.onDragStart({
        preventDefault() {},
        dataTransfer: { setData() {}, effectAllowed: "all" },
      } as never),
    );
    expect(result.current.dragging).toBe(true);
    act(() => {
      window.dispatchEvent(new Event("pointerdown"));
    });
    expect(result.current.dragging).toBe(false);
  });
  it("sortable cancels keyboard sorting when focus leaves and supports custom messages", async () => {
    function Demo() {
      const [items, setItems] = useState(["a", "b", "c"]);
      const sortable = useSortable(items, {
        getKey: (item) => item,
        onChange: setItems,
        messages: { cancelled: "cancelled!", roleDescription: "sortable" },
      });
      return (
        <>
          {items.map((item) => (
            <div key={item} data-testid={item} {...sortable.getItemProps(item)}>
              {item}
            </div>
          ))}
          <button>outside</button>
          <output>{sortable.announcement}</output>
          <span data-testid="order">{items.join("")}</span>
        </>
      );
    }
    render(<Demo />);
    const a = screen.getByTestId("a");
    expect(a.getAttribute("aria-roledescription")).toBe("sortable");
    a.focus();
    fireEvent.keyDown(a, { key: " " });
    fireEvent.keyDown(a, { key: "ArrowDown" });
    expect(screen.getByTestId("order").textContent).toBe("bac");
    screen.getByText("outside").focus();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("cancelled!"),
    );
    expect(screen.getByTestId("order").textContent).toBe("abc");
    const b = screen.getByTestId("b");
    b.focus();
    fireEvent.keyDown(b, { key: " " });
    fireEvent.keyDown(b, { key: "ArrowDown" });
    expect(screen.getByTestId("order").textContent).toBe("acb");
  });
});

describe("lists", () => {
  it("useInfiniteScroll accepts null as the initial cursor", async () => {
    const service = vi.fn(async ({ cursor }: { cursor: number | null }) => ({
      items: [cursor ?? 0],
      nextCursor: cursor === null ? 1 : null,
    }));
    const { result } = renderHook(() =>
      useInfiniteScroll(service, { initialCursor: null as number | null }),
    );
    await waitFor(() => expect(result.current.items).toEqual([0]));
    await act(() => result.current.loadMore());
    expect(result.current.items).toEqual([0, 1]);
    expect(result.current.hasMore).toBe(false);
    await act(() => result.current.loadMore());
    expect(service).toHaveBeenCalledTimes(2);
  });
  it("keeps one IntersectionObserver and keeps loading while the sentinel stays visible", async () => {
    let callback!: IntersectionObserverCallback;
    const Constructor = vi.fn(
      class {
        constructor(fn: IntersectionObserverCallback) {
          callback = fn;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("IntersectionObserver", Constructor);
    const sentinel = document.createElement("div");
    const service = vi.fn(async ({ cursor }: { cursor: number }) => ({
      items: [cursor],
      nextCursor: cursor < 2 ? cursor + 1 : null,
    }));
    const { result, rerender } = renderHook(() =>
      useInfiniteScroll(service, { initialCursor: 0, sentinel }),
    );
    await waitFor(() => expect(result.current.items).toEqual([0]));
    rerender();
    rerender();
    expect(Constructor).toHaveBeenCalledTimes(1);
    act(() =>
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    await waitFor(() => expect(result.current.items).toEqual([0, 1, 2]));
    expect(result.current.hasMore).toBe(false);
    expect(Constructor).toHaveBeenCalledTimes(1);
  });
});

describe("table", () => {
  const filters = (value: unknown) => value as { q: string; status?: string };
  it("ignores URL events that do not change the table query", async () => {
    history.replaceState(null, "", "/");
    const service = vi.fn(async () => ({ list: [], total: 0 }));
    renderHook(() =>
      useTable(service, {
        initialFilters: { q: "" },
        select: (value) => value,
        urlState: { key: "table", parseFilters: filters },
      }),
    );
    await waitFor(() => expect(service).toHaveBeenCalledTimes(1));
    act(() => {
      history.replaceState(null, "", "/?other=1");
      window.dispatchEvent(new Event("web-hooks:url"));
    });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(service).toHaveBeenCalledTimes(1);
  });
  it("presets replace filters instead of merging with the draft", async () => {
    const service = vi.fn(async () => ({ list: [], total: 0 }));
    const { result } = renderHook(() =>
      useTable<never, { q: string; status?: string }>(service, {
        initialFilters: { q: "" },
        select: (value) => value,
        filterPresets: { saved: { q: "preset" } },
      }),
    );
    act(() => result.current.search.setDraft({ status: "open" }));
    act(() => result.current.applyPreset("saved"));
    expect(result.current.search.submitted).toEqual({ q: "preset" });
  });
});

describe("transition", () => {
  it("preEnter mounts with start styles for two frames before entering", () => {
    vi.useFakeTimers();
    const enter = vi.fn();
    const { result, rerender } = renderHook(
      ({ open }) =>
        useTransitionState(open, {
          preEnter: true,
          enterDuration: 300,
          onEnter: enter,
        }),
      { initialProps: { open: false } },
    );
    rerender({ open: true });
    expect(result.current.phase).toBe("preEnter");
    expect(result.current.mounted).toBe(true);
    expect(enter).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(50));
    expect(result.current.phase).toBe("entering");
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.phase).toBe("entered");
    expect(enter).toHaveBeenCalledTimes(1);
  });
});

describe("queue and upload", () => {
  it("retryOnTimeout retries and ignores the late result of a timed-out attempt", async () => {
    vi.useFakeTimers();
    const releases: ((value: string) => void)[] = [];
    const { result } = renderHook(() =>
      useAsyncQueue<string>({
        concurrency: 2,
        timeout: 20,
        retry: 1,
        retryOnTimeout: true,
      }),
    );
    let task!: ReturnType<typeof result.current.add>;
    act(() => {
      task = result.current.add(
        () => new Promise<string>((resolve) => releases.push(resolve)),
      );
    });
    await act(() => vi.advanceTimersByTimeAsync(25));
    expect(releases).toHaveLength(2);
    await act(async () => {
      releases[0]!("late");
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.tasks[0]!.status).toBe("running");
    await act(async () => {
      releases[1]!("fresh");
      await vi.advanceTimersByTimeAsync(0);
    });
    await expect(task.promise).resolves.toBe("fresh");
    expect(result.current.tasks[0]).toMatchObject({
      status: "success",
      result: "fresh",
      attempts: 2,
    });
  });
  it("useUpload forwards queue options and only tracks accepted files", async () => {
    let attempts = 0;
    const transport = vi.fn(async () => {
      if (!attempts++) throw new Error("flaky");
      return "ok";
    });
    const { result } = renderHook(() =>
      useUpload({ transport, retry: 1, capacity: 1 }),
    );
    let tasks!: ReturnType<typeof result.current.add>;
    act(() => {
      tasks = result.current.add([new File(["a"], "a"), new File(["b"], "b")]);
    });
    expect(tasks.map((task) => task.accepted)).toEqual([true, false]);
    await act(() => tasks[0]!.promise);
    expect(result.current.uploads).toHaveLength(1);
    expect(result.current.uploads[0]).toMatchObject({
      status: "success",
      progress: 100,
    });
  });
});

describe("requests and queries", () => {
  it("mutate wins over a request that was already in flight", async () => {
    let release!: (value: string) => void;
    const { result } = renderHook(() =>
      useRequest(
        () => new Promise<string>((resolve) => (release = resolve)),
        { initialData: "initial" },
      ),
    );
    act(() => result.current.run());
    expect(result.current.fetching).toBe(true);
    act(() => result.current.mutate("local"));
    expect(result.current.fetching).toBe(false);
    await act(async () => {
      release("server");
      await Promise.resolve();
    });
    expect(result.current.data).toBe("local");
  });
  it("non-exact string invalidation respects word boundaries", async () => {
    const service = vi.fn(async (_context: unknown, key: string) => key);
    const store = createQueryStore(service, { staleTime: Infinity });
    const keys = ["user", "user:1", "users"];
    const unsubscribe = keys.map((key) => store.subscribe(key, () => {}));
    await waitFor(() => expect(service).toHaveBeenCalledTimes(3));
    service.mockClear();
    store.invalidate("user", { exact: false });
    await waitFor(() =>
      expect(service.mock.calls.map((call) => call[1]).sort()).toEqual([
        "user",
        "user:1",
      ]),
    );
    unsubscribe.forEach((stop) => stop());
  });
  it("inline select keeps the previous data reference when the result is equal", async () => {
    const store = createQueryStore(async () => ({ items: [1, 2] }));
    const { result, rerender } = renderHook(() =>
      useQuery(store, "list", { select: (data) => ({ count: data.items.length }) }),
    );
    await waitFor(() => expect(result.current.data).toEqual({ count: 2 }));
    const first = result.current.data;
    rerender();
    rerender();
    expect(result.current.data).toBe(first);
  });
});

describe("browser helpers", () => {
  it("useImage never reports the previous image for a new src", () => {
    const images: { onload: null | (() => void); src: string }[] = [];
    vi.stubGlobal(
      "Image",
      class {
        onload: null | (() => void) = null;
        onerror = null;
        naturalWidth = 10;
        naturalHeight = 10;
        src = "";
        constructor() {
          images.push(this);
        }
      },
    );
    const seen: { input: string; src: string | null; status: string }[] = [];
    const { rerender } = renderHook(
      ({ src }) => {
        const state = useImage(src);
        seen.push({ input: src, src: state.src, status: state.status });
        return state;
      },
      { initialProps: { src: "a" } },
    );
    act(() => images[0]!.onload!());
    expect(seen.at(-1)).toEqual({ input: "a", src: "a", status: "loaded" });
    rerender({ src: "b" });
    expect(
      seen.filter((entry) => entry.input === "b" && entry.src !== "b"),
    ).toEqual([]);
    expect(seen.at(-1)).toEqual({ input: "b", src: "b", status: "loading" });
  });
  it("useFullscreen supports the webkit-prefixed API", async () => {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => void;
    };
    const node = document.createElement("div") as HTMLDivElement & {
      webkitRequestFullscreen?: () => void;
    };
    root.webkitRequestFullscreen = () => {};
    node.webkitRequestFullscreen = () => {
      doc.webkitFullscreenElement = node;
      document.dispatchEvent(new Event("webkitfullscreenchange"));
    };
    try {
      const { result } = renderHook(() => useFullscreen(node));
      expect(result.current.supported).toBe(true);
      await act(async () => {
        expect(await result.current.enter()).toBe(true);
      });
      expect(result.current.active).toBe(true);
    } finally {
      delete root.webkitRequestFullscreen;
      delete doc.webkitFullscreenElement;
    }
  });
  it("useTextSelection does not re-render for unchanged selections", () => {
    let renders = 0;
    renderHook(() => {
      renders++;
      return useTextSelection();
    });
    const before = renders;
    act(() => {
      for (let i = 0; i < 5; i++) window.dispatchEvent(new Event("scroll"));
      document.dispatchEvent(new Event("selectionchange"));
    });
    expect(renders).toBe(before);
  });
  it("useTextareaAutoSize only measures when its inputs change", () => {
    const spy = vi.spyOn(window, "getComputedStyle");
    let force!: () => void;
    function Demo({ value }: { value: string }) {
      const ref = useRef<HTMLTextAreaElement>(null);
      const [, setTick] = useState(0);
      force = () => setTick((n) => n + 1);
      useTextareaAutoSize(ref, value);
      return <textarea ref={ref} value={value} readOnly />;
    }
    const view = render(<Demo value="a" />);
    const measured = spy.mock.calls.length;
    expect(measured).toBeGreaterThan(0);
    act(() => force());
    act(() => force());
    expect(spy.mock.calls.length).toBe(measured);
    view.rerender(<Demo value="b" />);
    expect(spy.mock.calls.length).toBeGreaterThan(measured);
  });
});
