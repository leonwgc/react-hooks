import {
  act,
  fireEvent,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { StrictMode, useRef, useState } from "react";
import { expect, it, vi } from "vitest";
import {
  useRequest,
  createQueryStore,
  useQuery,
  useForm,
  useFieldArray,
  useSelection,
  useAsyncQueue,
  useUndoRedo,
  useTransitionState,
  type QueryKey,
} from "../src";

it("gates requests, refreshes changed dependencies and separates delayed loading from fetching", async () => {
  vi.useFakeTimers();
  const service = vi.fn(async (_context, page: number) => {
    await new Promise((r) => setTimeout(r, 50));
    return page;
  });
  const before = vi.fn(),
    finallyCallback = vi.fn();
  const hook = renderHook(
    ({ ready, page }) =>
      useRequest(service, {
        manual: false,
        defaultParams: [page],
        ready,
        refreshDeps: [page],
        loadingDelay: 100,
        onBefore: before,
        onFinally: finallyCallback,
      }),
    { initialProps: { ready: false, page: 1 } },
  );
  await expect(hook.result.current.runAsync(9)).rejects.toMatchObject({
    name: "NotReadyError",
  });
  expect(service).not.toHaveBeenCalled();
  hook.rerender({ ready: true, page: 1 });
  expect(hook.result.current.fetching).toBe(true);
  expect(hook.result.current.loading).toBe(false);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });
  expect(hook.result.current.data).toBe(1);
  expect(hook.result.current.loading).toBe(false);
  expect(finallyCallback).toHaveBeenCalledWith(1, undefined, [1]);
  hook.rerender({ ready: true, page: 2 });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });
  expect(hook.result.current.data).toBe(2);
  expect(before).toHaveBeenCalledTimes(2);
  hook.rerender({ ready: false, page: 3 });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(service).toHaveBeenCalledTimes(2);
  hook.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("clears delayed loading on replacement and calls final callbacks once after retry", async () => {
  vi.useFakeTimers();
  const service = vi
    .fn()
    .mockRejectedValueOnce(Error("retry"))
    .mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 40));
      return "ok";
    });
  const finish = vi.fn();
  const hook = renderHook(() =>
    useRequest(service, {
      retry: 1,
      retryDelay: 10,
      loadingDelay: 20,
      onFinally: finish,
    }),
  );
  let promise!: Promise<string>;
  act(() => {
    promise = hook.result.current.runAsync();
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(21);
  });
  expect(hook.result.current.loading).toBe(true);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(29);
    await promise;
  });
  expect(finish).toHaveBeenCalledTimes(1);
  expect(hook.result.current.fetching).toBe(false);
  act(() => {
    promise = hook.result.current.runAsync().catch(() => "cancelled");
  });
  act(() => hook.result.current.cancel());
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
    await promise;
  });
  expect(hook.result.current.loading).toBe(false);
  expect(finish).toHaveBeenCalledTimes(1);
});
it("canonicalizes structured keys, deduplicates and invalidates only the matching prefix", async () => {
  const service = vi.fn(async (_context, key: QueryKey) => key);
  const store = createQueryStore(service);
  const a = store.fetch(["users", { b: 2, a: 1 }]),
    b = store.fetch(["users", { a: 1, b: 2 }]);
  expect(a).toBe(b);
  await a;
  const users = renderHook(() => useQuery(store, ["users", { a: 1, b: 2 }]));
  const other = renderHook(() => useQuery(store, ["other", 1]));
  await waitFor(() => expect(other.result.current.status).toBe("success"));
  act(() => store.invalidate(["users"], { exact: false }));
  await waitFor(() => expect(service).toHaveBeenCalledTimes(3));
  await waitFor(() => expect(users.result.current.isFetching).toBe(false));
  users.unmount();
  other.unmount();
  store.clear();
});
it("query selectors can ignore unrelated data updates and retain previous key data", async () => {
  const store = createQueryStore(async (_context, key: string) => ({
    count: key.length,
    note: key,
  }));
  store.setData("a", { count: 1, note: "a" });
  let renders = 0;
  const hook = renderHook(
    ({ key }) => {
      renders++;
      return useQuery(store, key, {
        select: (data) => data.count,
        notifyOnChangeProps: ["data"],
        keepPreviousData: true,
      });
    },
    { initialProps: { key: "a" } },
  );
  const before = renders;
  act(() => store.setData("a", { count: 1, note: "changed" }));
  expect(renders).toBe(before);
  hook.rerender({ key: "long" });
  expect(hook.result.current.data).toBe(1);
  expect(hook.result.current.isPreviousData).toBe(true);
  await waitFor(() => expect(hook.result.current.data).toBe(4));
  expect(hook.result.current.isPreviousData).toBe(false);
  hook.unmount();
  store.clear();
});
it("equivalent query key rerenders do not refetch", async () => {
  const service = vi.fn(async () => 1),
    store = createQueryStore<number, QueryKey>(service, { staleTime: 0 });
  const hook = renderHook(
    ({ revision }) => {
      void revision;
      return useQuery(store, ["items", { page: 1 }], {
        keepPreviousData: true,
      });
    },
    { initialProps: { revision: 0 } },
  );
  await waitFor(() => expect(hook.result.current.data).toBe(1));
  hook.rerender({ revision: 1 });
  expect(service).toHaveBeenCalledTimes(1);
  hook.unmount();
  store.clear();
});
it("resetField restores one baseline and unregister suppresses validators without touching other fields", async () => {
  const check = vi.fn((value: string | undefined) =>
    value ? undefined : "required",
  );
  const hook = renderHook(() =>
    useForm<{ name: string; extra?: string }>({
      initialValues: { name: "base", extra: "extra" },
      validators: { extra: check },
    }),
  );
  act(() => {
    hook.result.current.setFieldValue("name", "changed");
    hook.result.current.setFieldValue("extra", "");
    hook.result.current.setFieldError("name", "error");
    hook.result.current.setFieldTouched("name");
  });
  act(() => hook.result.current.resetField("name"));
  expect(hook.result.current.values.name).toBe("base");
  expect(hook.result.current.values.extra).toBe("");
  expect(hook.result.current.errors.name).toBeUndefined();
  act(() => hook.result.current.unregister("extra"));
  expect(hook.result.current.values).toEqual({ name: "base" });
  await act(async () => {
    expect(await hook.result.current.validate()).toBe(true);
  });
  expect(check).not.toHaveBeenCalled();
  act(() =>
    hook.result.current.resetField("name", { defaultValue: "new baseline" }),
  );
  expect(hook.result.current.values.name).toBe("new baseline");
});
it("hidden fields unregister after real detachment but survive strict mode ref replay", async () => {
  function Demo() {
    const [shown, setShown] = useState(true);
    const form = useForm<{ field?: string }>({
      initialValues: { field: "kept" },
      shouldUnregister: true,
    });
    return (
      <>
        <button onClick={() => setShown((v) => !v)}>toggle</button>
        {shown && <input {...form.register("field")} />}
        <output>{JSON.stringify(form.values)}</output>
      </>
    );
  }
  const view = render(
    <StrictMode>
      <Demo />
    </StrictMode>,
  );
  await act(async () => {});
  expect(view.container.querySelector("input")?.value).toBe("kept");
  fireEvent.click(view.getByText("toggle"));
  await waitFor(() =>
    expect(view.container.querySelector("output")?.textContent).toBe("{}"),
  );
});
it("array edits preserve IDs and metadata by record and reset invalidates array identities", () => {
  const hook = renderHook(() => {
    const form = useForm({
      initialValues: { rows: [{ name: "A" }, { name: "B" }, { name: "C" }] },
    });
    return { form, array: useFieldArray(form, "rows") };
  });
  const ids = hook.result.current.array.fields.map((f) => f.id);
  act(() => {
    hook.result.current.form.setFieldError("rows.1.name", "B error");
    hook.result.current.form.setFieldTouched("rows.1.name");
    hook.result.current.array.move(1, 0);
  });
  expect(hook.result.current.array.fields[0].id).toBe(ids[1]);
  expect(hook.result.current.form.errors["rows.0.name"]).toBe("B error");
  expect(hook.result.current.form.touched["rows.0.name"]).toBe(true);
  act(() => {
    hook.result.current.array.prepend({ name: "new" });
    hook.result.current.array.swap(1, 3);
  });
  expect(hook.result.current.form.errors["rows.3.name"]).toBe("B error");
  act(() => hook.result.current.array.update(3, { name: "B edited" }));
  expect(hook.result.current.array.fields[3].id).toBe(ids[1]);
  act(() => hook.result.current.array.remove(3));
  expect(hook.result.current.form.errors).toEqual({});
  act(() => hook.result.current.form.resetField("rows"));
  expect(hook.result.current.form.values.rows.map((x) => x.name)).toEqual([
    "A",
    "B",
    "C",
  ]);
  expect(hook.result.current.array.fields[0].id).not.toBe(ids[0]);
});
it("range selection skips disabled keys, caps selection and clears anchors on reset", () => {
  const hook = renderHook(
    ({ reset }) =>
      useSelection(["a", "b", "c", "d"], {
        disabledKeys: ["b"],
        maxSelected: 2,
        resetKey: reset,
      }),
    { initialProps: { reset: 0 } },
  );
  act(() => hook.result.current.toggle("a"));
  act(() => hook.result.current.toggle("d", { range: true }));
  expect(hook.result.current.selectedKeys).toEqual(["a", "c"]);
  expect(hook.result.current.isAtLimit).toBe(true);
  act(() => hook.result.current.toggle("b"));
  expect(hook.result.current.selectedKeys).toEqual(["a", "c"]);
  hook.rerender({ reset: 1 });
  act(() => hook.result.current.toggle("d", { range: true }));
  expect(hook.result.current.selectedKeys).toEqual(["d"]);
  act(() => hook.result.current.selectRange("a", "d", false));
  expect(hook.result.current.selectedKeys).toEqual([]);
});
it("queues prioritize waiting tasks without exceeding capacity", async () => {
  const order: string[] = [];
  const hook = renderHook(() =>
    useAsyncQueue<string>({ concurrency: 1, capacity: 2 }),
  );
  act(() => hook.result.current.pause());
  let low!: ReturnType<typeof hook.result.current.add>,
    high!: typeof low,
    full!: typeof low;
  act(() => {
    low = hook.result.current.add(
      async () => {
        order.push("low");
        return "low";
      },
      "low",
      { priority: 1 },
    );
    high = hook.result.current.add(
      async () => {
        order.push("high");
        return "high";
      },
      "high",
      { priority: 9 },
    );
    full = hook.result.current.add(async () => "full");
  });
  await expect(full.promise).rejects.toMatchObject({
    name: "QueueCapacityError",
  });
  await act(async () => {
    hook.result.current.resume();
    await Promise.all([low.promise, high.promise]);
  });
  expect(order).toEqual(["high", "low"]);
});
it("queue retries failed tasks and cancels retry timers", async () => {
  vi.useFakeTimers();
  const run = vi
    .fn()
    .mockRejectedValueOnce(Error("fail"))
    .mockResolvedValue("ok");
  const hook = renderHook(() =>
    useAsyncQueue<string>({ retry: 1, retryDelay: 50 }),
  );
  let task!: ReturnType<typeof hook.result.current.add>;
  act(() => {
    task = hook.result.current.add(run);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(51);
    await task.promise;
  });
  expect(run).toHaveBeenCalledTimes(2);
  expect(hook.result.current.tasks[0].retryCount).toBe(1);
  act(() => {
    task = hook.result.current.add(async () => {
      throw Error("again");
    });
  });
  await act(async () => {});
  act(() => hook.result.current.cancel(task.id));
  await expect(task.promise).rejects.toMatchObject({ name: "AbortError" });
  hook.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("queue timeouts reject promptly but retain occupied slots until uncooperative work ends", async () => {
  vi.useFakeTimers();
  let release!: (value: string) => void;
  const next = vi.fn(async () => "next");
  const hook = renderHook(() =>
    useAsyncQueue<string>({ concurrency: 1, timeout: 20, retry: 2 }),
  );
  let slow!: ReturnType<typeof hook.result.current.add>, queued!: typeof slow;
  act(() => {
    slow = hook.result.current.add(() => new Promise((r) => (release = r)));
    queued = hook.result.current.add(next);
  });
  const failed = slow.promise.catch((error) => error);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(21);
  });
  expect(await failed).toMatchObject({ name: "TimeoutError" });
  expect(next).not.toHaveBeenCalled();
  await act(async () => {
    release("late");
    await queued.promise;
  });
  expect(next).toHaveBeenCalledTimes(1);
  expect(hook.result.current.tasks[0].status).toBe("error");
});
it("history coalesces typing and isolates explicit transaction commit and rollback", () => {
  vi.useFakeTimers();
  const hook = renderHook(() => useUndoRedo("", { mergeWindow: 300 }));
  act(() => {
    hook.result.current.set("a", { group: "typing", label: "输入" });
    hook.result.current.set("ab", { group: "typing", label: "输入" });
  });
  expect(hook.result.current.past).toHaveLength(1);
  act(() => hook.result.current.undo());
  expect(hook.result.current.value).toBe("");
  expect(hook.result.current.redoLabel).toBe("输入");
  act(() => hook.result.current.redo());
  act(() => {
    hook.result.current.beginTransaction("批量修改");
    hook.result.current.set("first");
    hook.result.current.set("second");
  });
  expect(hook.result.current.inTransaction).toBe(true);
  expect(hook.result.current.canUndo).toBe(false);
  act(() => hook.result.current.rollbackTransaction());
  expect(hook.result.current.value).toBe("ab");
  act(() => {
    hook.result.current.beginTransaction("提交修改");
    hook.result.current.set("done");
    hook.result.current.commitTransaction();
  });
  expect(hook.result.current.undoLabel).toBe("提交修改");
  act(() => hook.result.current.undo());
  expect(hook.result.current.value).toBe("ab");
});
it("transition completion filters child events and properties, invokes lifecycle once and retains fallback", () => {
  vi.useFakeTimers();
  const enter = vi.fn(),
    entered = vi.fn(),
    exit = vi.fn(),
    exited = vi.fn();
  function Demo({ open }: { open: boolean }) {
    const s = useTransitionState(open, {
      enterDuration: 1000,
      exitDuration: 200,
      propertyName: "opacity",
      onEnter: enter,
      onEntered: entered,
      onExit: exit,
      onExited: exited,
    });
    return (
      <>
        {s.mounted && (
          <div data-testid="panel" {...s.bind}>
            <span data-testid="child" />
          </div>
        )}
        <output>{s.phase}</output>
      </>
    );
  }
  const view = render(<Demo open={false} />);
  view.rerender(<Demo open />);
  expect(enter).toHaveBeenCalledTimes(1);
  fireEvent.transitionEnd(view.getByTestId("child"), {
    propertyName: "opacity",
  });
  expect(entered).not.toHaveBeenCalled();
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: "opacity" });
  fireEvent(view.getByTestId("panel"), event);
  expect(entered).toHaveBeenCalledTimes(1);
  view.rerender(<Demo open={false} />);
  expect(exit).toHaveBeenCalledTimes(1);
  act(() => vi.advanceTimersByTime(200));
  expect(exited).toHaveBeenCalledTimes(1);
  expect(view.queryByTestId("panel")).toBeNull();
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("removing registered array rows with shouldUnregister never recreates a deleted row", async () => {
  function Demo() {
    const form = useForm({
      initialValues: { rows: [{ name: "A" }, { name: "B" }] },
      shouldUnregister: true,
    });
    const array = useFieldArray(form, "rows");
    return (
      <>
        <button onClick={() => array.remove(0)}>remove row</button>
        {array.fields.map((row, i) => (
          <input key={row.id} {...form.register(`rows.${i}.name`)} />
        ))}
        <output>{JSON.stringify(form.values.rows)}</output>
      </>
    );
  }
  const view = render(
    <StrictMode>
      <Demo />
    </StrictMode>,
  );
  fireEvent.click(view.getByText("remove row"));
  await act(async () => {});
  expect(view.container.querySelector("output")?.textContent).toBe(
    '[{"name":"B"}]',
  );
  expect(view.container.querySelectorAll("input")).toHaveLength(1);
});
it("previous query data does not cross store or null-key boundaries", () => {
  const first = createQueryStore(async () => 1),
    second = createQueryStore(async () => 2);
  first.setData("a", 1);
  const initialProps: { store: typeof first; key: string | null } = {
    store: first,
    key: "a",
  };
  const hook = renderHook(
    ({ store, key }: { store: typeof first; key: string | null }) =>
      useQuery(store, key, { enabled: false, keepPreviousData: true }),
    { initialProps },
  );
  hook.rerender({ store: second, key: "b" });
  expect(hook.result.current.data).toBeUndefined();
  expect(hook.result.current.isPreviousData).toBe(false);
  hook.rerender({ store: first, key: "a" });
  expect(hook.result.current.data).toBe(1);
  hook.rerender({ store: first, key: null });
  expect(hook.result.current.data).toBeUndefined();
  hook.rerender({ store: first, key: "b" });
  expect(hook.result.current.data).toBeUndefined();
  hook.unmount();
  first.clear();
  second.clear();
});
it("query subscription options can change without a cache write", () => {
  const store = createQueryStore(async () => ({ count: 1 }));
  store.setData("a", { count: 1 });
  const select = (value: { count: number }) => value.count;
  const hook = renderHook(
    ({ fields }: { fields: ("data" | "isFetching")[] }) =>
      useQuery(store, "a", {
        enabled: false,
        select,
        notifyOnChangeProps: fields,
      }),
    { initialProps: { fields: ["data"] } },
  );
  act(() => {
    void store.fetch("a", true).catch(() => {});
  });
  expect(hook.result.current.isFetching).toBe(false);
  hook.rerender({ fields: ["data", "isFetching"] });
  expect(hook.result.current.isFetching).toBe(true);
  hook.unmount();
  store.clear();
});
it("resetField invalidates in-flight validation and preserves requested metadata", async () => {
  let resolve!: (value: string) => void;
  const hook = renderHook(() =>
    useForm({
      initialValues: { name: "base" },
      validators: {
        name: () =>
          new Promise<string>((done) => {
            resolve = done;
          }),
      },
    }),
  );
  let validation!: Promise<boolean>;
  act(() => {
    validation = hook.result.current.validate();
  });
  act(() => {
    hook.result.current.setFieldError("name", "keep");
    hook.result.current.setFieldTouched("name");
    hook.result.current.resetField("name", {
      keepError: true,
      keepTouched: true,
    });
  });
  await act(async () => {
    resolve("outdated");
    await validation;
  });
  expect(hook.result.current.errors.name).toBe("keep");
  expect(hook.result.current.touched.name).toBe(true);
  expect(hook.result.current.isValidating).toBe(false);
});

it("successful queue tasks are not reported as aborted during cleanup", async () => {
  const aborted = vi.fn();
  const hook = renderHook(() => useAsyncQueue<number>());
  let task!: ReturnType<typeof hook.result.current.add>;
  await act(async () => {
    task = hook.result.current.add(async (signal) => {
      signal.addEventListener("abort", aborted);
      return 42;
    });
    expect(await task.promise).toBe(42);
  });
  hook.unmount();
  expect(aborted).not.toHaveBeenCalled();
});
