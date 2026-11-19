import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef } from "react";
import { afterEach, expect, it, vi } from "vitest";
import {
  useAsyncQueue,
  useUpload,
  useInfiniteScroll,
  useVirtualList,
  useUndoRedo,
  useLeaveConfirm,
  useFocusWithin,
  useLongPress,
  useMutationObserver,
  useImage,
  useFullscreen,
  useBroadcastChannel,
  useEventSource,
  useTextSelection,
  useDownload,
  useDrag,
  useDrop,
  createXHRUploadTransport,
} from "../src";
afterEach(() => vi.unstubAllGlobals());
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { resolve, reject, promise };
}

it("limits concurrent tasks and preserves capacity until cancelled transports settle", async () => {
  const first = deferred<number>(),
    second = deferred<number>();
  const run = vi.fn(() => second.promise);
  const { result } = renderHook(() =>
    useAsyncQueue<number>({ concurrency: 1 }),
  );
  let a!: ReturnType<typeof result.current.add>;
  let b!: ReturnType<typeof result.current.add>;
  act(() => {
    a = result.current.add(() => first.promise);
    b = result.current.add(run);
  });
  await act(async () => {});
  expect(run).not.toHaveBeenCalled();
  act(() => result.current.cancel(a.id));
  await expect(a.promise).rejects.toMatchObject({ name: "AbortError" });
  expect(run).not.toHaveBeenCalled();
  await act(async () => {
    first.resolve(1);
  });
  expect(run).toHaveBeenCalledTimes(1);
  await act(async () => {
    second.resolve(2);
    await b.promise;
  });
  expect(result.current.tasks.map((t) => t.status)).toEqual([
    "cancelled",
    "success",
  ]);
});
it("pauses queue dispatch, cancels waiting tasks and clears settled entries", async () => {
  const fn = vi.fn(async () => 1);
  const { result } = renderHook(() => useAsyncQueue<number>());
  act(() => result.current.pause());
  let a!: ReturnType<typeof result.current.add>;
  act(() => {
    a = result.current.add(fn);
  });
  expect(result.current.pending).toBe(1);
  act(() => result.current.cancelAll());
  await expect(a.promise).rejects.toMatchObject({ name: "AbortError" });
  act(() => {
    result.current.resume();
    result.current.clear();
  });
  expect(fn).not.toHaveBeenCalled();
  expect(result.current.tasks).toHaveLength(0);
});
it("tracks upload progress, errors and retries with the original File", async () => {
  const file = new File(["abc"], "note.txt");
  let attempts = 0;
  const transport = vi.fn(
    async ({
      file: received,
      onProgress,
    }: {
      file: File;
      onProgress: (a: number, b: number) => void;
    }) => {
      expect(received).toBe(file);
      onProgress(1, 2);
      if (!attempts++) throw new Error("offline");
      return "ok";
    },
  );
  const { result } = renderHook(() => useUpload({ transport, concurrency: 1 }));
  let task!: ReturnType<typeof result.current.add>[number];
  act(() => {
    task = result.current.add([file])[0]!;
  });
  await act(async () => {
    await task.promise.catch(() => {});
  });
  expect(result.current.uploads[0]?.status).toBe("error");
  expect(result.current.uploads[0]?.progress).toBe(50);
  await act(async () => {
    await result.current.retry(task.id)?.promise;
  });
  // The retried upload replaces the failed row instead of duplicating it.
  expect(result.current.uploads).toHaveLength(1);
  expect(result.current.uploads[0]?.status).toBe("success");
  expect(result.current.uploads[0]?.progress).toBe(100);
});
it("XHR upload submits FormData, reports progress and removes abort listeners", async () => {
  class XHR {
    upload: {
      onprogress:
        | ((e: {
            lengthComputable: boolean;
            loaded: number;
            total: number;
          }) => void)
        | null;
    } = { onprogress: null };
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;
    status = 201;
    responseText = "saved";
    withCredentials = false;
    open = vi.fn();
    setRequestHeader = vi.fn();
    send = vi.fn();
    abort = vi.fn(() => this.onabort?.());
  }
  const xhr = new XHR();
  vi.stubGlobal(
    "XMLHttpRequest",
    class {
      constructor() {
        return xhr;
      }
    },
  );
  const abort = new AbortController();
  const progress = vi.fn();
  const promise = createXHRUploadTransport({ url: "/upload" })({
    file: new File(["x"], "x.txt"),
    signal: abort.signal,
    onProgress: progress,
  });
  expect(xhr.send).toHaveBeenCalledWith(expect.any(FormData));
  xhr.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 2 });
  expect(progress).toHaveBeenCalledWith(1, 2);
  xhr.onload?.();
  await expect(promise).resolves.toBe("saved");
  abort.abort();
  expect(xhr.abort).not.toHaveBeenCalled();
});
it("deduplicates page loads, appends unique items and stops at the final cursor", async () => {
  const page = deferred<{ items: number[]; nextCursor: number | null }>();
  const fn = vi.fn(() => page.promise);
  const { result } = renderHook(() =>
    useInfiniteScroll(fn, { initialCursor: 0, manual: true, getKey: (n) => n }),
  );
  let first!: Promise<void>;
  let second!: Promise<void>;
  act(() => {
    first = result.current.loadMore();
    second = result.current.loadMore();
  });
  expect(first).toBe(second);
  await act(async () => {
    page.resolve({ items: [1, 1, 2], nextCursor: null });
    await first;
  });
  expect(result.current.items).toEqual([1, 2]);
  expect(result.current.hasMore).toBe(false);
  await result.current.loadMore();
  expect(fn).toHaveBeenCalledTimes(1);
});
it("isolates responses after query resets and retries the same cursor", async () => {
  const old = deferred<{ items: string[]; nextCursor: number | null }>();
  const service = vi
    .fn()
    .mockImplementationOnce(() => old.promise)
    .mockRejectedValueOnce(new Error("retry"))
    .mockResolvedValue({ items: ["new"], nextCursor: null });
  const { result, rerender } = renderHook(
    ({ key }) =>
      useInfiniteScroll<string, number>(service, {
        initialCursor: 0,
        resetKey: key,
        manual: true,
      }),
    { initialProps: { key: "a" } },
  );
  let first!: Promise<void>;
  act(() => {
    first = result.current.loadMore();
  });
  await act(async () => {});
  rerender({ key: "b" });
  await act(async () => {
    old.resolve({ items: ["old"], nextCursor: null });
    await first.catch(() => {});
  });
  expect(result.current.items).toEqual([]);
  await act(async () => {
    await result.current.loadMore().catch(() => {});
  });
  expect(result.current.error).toBeInstanceOf(Error);
  await act(async () => {
    await result.current.retry();
  });
  expect(result.current.items).toEqual(["new"]);
  expect(service.mock.calls[2]?.[0].cursor).toBe(0);
});
it("virtualizes large lists and scrolls to a stable item", () => {
  const items = Array.from({ length: 1000 }, (_, i) => i);
  let api!: ReturnType<typeof useVirtualList<number>>;
  function Demo() {
    api = useVirtualList(items, {
      height: 100,
      itemHeight: 20,
      overscan: 1,
      getKey: (n) => n,
    });
    return (
      <div
        ref={api.containerRef}
        onScroll={api.onScroll}
        style={api.containerStyle}
      />
    );
  }
  render(<Demo />);
  expect(api.virtualItems.length).toBeLessThan(10);
  expect(api.totalHeight).toBe(20000);
  act(() => api.scrollTo(500));
  expect(api.virtualItems.some((row) => row.key === 500)).toBe(true);
  expect(api.virtualItems[0]?.index).toBe(499);
});
it("undo redo truncates branches and bounds history", () => {
  const { result } = renderHook(() => useUndoRedo(0, { limit: 2 }));
  act(() => {
    result.current.set(1);
    result.current.set(2);
    result.current.set(3);
  });
  act(() => {
    result.current.undo();
    result.current.undo();
    result.current.undo();
  });
  expect(result.current.value).toBe(1);
  act(() => result.current.redo());
  expect(result.current.value).toBe(2);
  act(() => result.current.set(5));
  expect(result.current.canRedo).toBe(false);
  act(() => result.current.reset(8));
  expect(result.current.canUndo).toBe(false);
  expect(result.current.value).toBe(8);
});
it("guards route actions and registers beforeunload only while dirty", async () => {
  const confirm = vi.fn(async () => false);
  const navigate = vi.fn();
  const { result, rerender, unmount } = renderHook(
    ({ dirty }) => useLeaveConfirm(dirty, { confirm }),
    { initialProps: { dirty: true } },
  );
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  await result.current.guard(navigate);
  expect(navigate).not.toHaveBeenCalled();
  rerender({ dirty: false });
  await result.current.guard(navigate);
  expect(navigate).toHaveBeenCalledOnce();
  unmount();
  const clean = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(clean);
  expect(clean.defaultPrevented).toBe(false);
});
it("keeps focus within a compound control until focus leaves", () => {
  function Demo() {
    const focus = useFocusWithin();
    return (
      <div {...focus.bind}>
        <input aria-label="a" />
        <input aria-label="b" />
        <output>{String(focus.focused)}</output>
      </div>
    );
  }
  render(<Demo />);
  fireEvent.focus(screen.getByLabelText("a"));
  expect(screen.getByText("true")).toBeTruthy();
  fireEvent.blur(screen.getByLabelText("a"), {
    relatedTarget: screen.getByLabelText("b"),
  });
  expect(screen.getByText("true")).toBeTruthy();
  fireEvent.blur(screen.getByLabelText("b"), { relatedTarget: null });
  expect(screen.getByText("false")).toBeTruthy();
});
it("long press fires once and cancels on movement or unmount", () => {
  vi.useFakeTimers();
  const fn = vi.fn();
  function Demo() {
    const press = useLongPress(fn);
    return <button {...press.bind}>hold</button>;
  }
  const { unmount } = render(<Demo />);
  const button = screen.getByText("hold");
  fireEvent.pointerDown(button, {
    button: 0,
    pointerId: 1,
    clientX: 0,
    clientY: 0,
  });
  act(() => vi.advanceTimersByTime(550));
  expect(fn).toHaveBeenCalledTimes(1);
  fireEvent.pointerUp(button, { pointerId: 1 });
  fireEvent.pointerDown(button, {
    button: 0,
    pointerId: 2,
    clientX: 0,
    clientY: 0,
  });
  fireEvent.pointerMove(button, { pointerId: 2, clientX: 30, clientY: 0 });
  act(() => vi.advanceTimersByTime(600));
  expect(fn).toHaveBeenCalledTimes(1);
  fireEvent.pointerDown(button, { button: 0, pointerId: 3 });
  unmount();
  act(() => vi.advanceTimersByTime(600));
  expect(fn).toHaveBeenCalledTimes(1);
});
it("observes mutations with current callbacks and disconnects", async () => {
  const callback = vi.fn();
  const node = document.createElement("div");
  const { unmount } = renderHook(() => useMutationObserver(node, callback));
  await act(async () => {
    node.appendChild(document.createElement("span"));
  });
  expect(callback).toHaveBeenCalledTimes(1);
  unmount();
  node.appendChild(document.createElement("b"));
  await Promise.resolve();
  expect(callback).toHaveBeenCalledTimes(1);
});
it("image loading falls back once and ignores callbacks after unmount", () => {
  const images: HTMLImageElement[] = [];
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 20;
      naturalHeight = 10;
      src = "";
      constructor() {
        images.push(this as unknown as HTMLImageElement);
      }
    },
  );
  const { result, unmount } = renderHook(() =>
    useImage("bad", { fallback: "good" }),
  );
  act(() => images[0]?.onerror?.(new Event("error")));
  expect(result.current.src).toBe("good");
  act(() => images[1]?.onload?.(new Event("load")));
  expect(result.current.status).toBe("loaded");
  unmount();
  expect(images[1]?.onload).toBeNull();
});
it("fullscreen exposes rejected user gesture requests", async () => {
  const node = document.createElement("div");
  node.requestFullscreen = vi.fn().mockRejectedValue(new Error("denied"));
  const { result } = renderHook(() => useFullscreen(node));
  await act(async () => {
    expect(await result.current.enter()).toBe(false);
  });
  expect(result.current.error).toMatchObject({ message: "denied" });
});
it("broadcast parses incoming messages, handles clone errors and closes on name changes", () => {
  class Channel {
    onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
    onmessageerror: (() => void) | null = null;
    close = vi.fn();
    postMessage = vi.fn();
    constructor(public name: string) {
      instances.push(this);
    }
  }
  const instances: Channel[] = [];
  vi.stubGlobal("BroadcastChannel", Channel);
  const { result, rerender, unmount } = renderHook(
    ({ name }) =>
      useBroadcastChannel(name, (value) => {
        if (typeof value !== "string") throw new Error("invalid");
        return value;
      }),
    { initialProps: { name: "one" } },
  );
  act(() =>
    instances[0]?.onmessage?.(new MessageEvent("message", { data: "hello" })),
  );
  expect(result.current.message).toBe("hello");
  act(() =>
    instances[0]?.onmessage?.(new MessageEvent("message", { data: 42 })),
  );
  expect(result.current.error).toBeInstanceOf(Error);
  rerender({ name: "two" });
  expect(instances[0]?.close).toHaveBeenCalledOnce();
  unmount();
  expect(instances[1]?.close).toHaveBeenCalledOnce();
});
it("SSE handles named messages, parse errors, reconnect and close", () => {
  class Source extends EventTarget {
    readyState = 0;
    close = vi.fn();
  }
  const instances: Source[] = [];
  const factory = () => {
    const source = new Source();
    instances.push(source);
    return source;
  };
  const { result, unmount } = renderHook(() =>
    useEventSource("/events", { parse: JSON.parse, event: "notice", factory }),
  );
  act(() => instances[0]?.dispatchEvent(new Event("open")));
  expect(result.current.status).toBe("open");
  act(() =>
    instances[0]?.dispatchEvent(
      new MessageEvent("notice", { data: '{"id":1}' }),
    ),
  );
  expect(result.current.data).toEqual({ id: 1 });
  act(() =>
    instances[0]?.dispatchEvent(new MessageEvent("notice", { data: "bad" })),
  );
  expect(result.current.error).toBeInstanceOf(Error);
  act(() => result.current.reconnect());
  expect(instances[0]?.close).toHaveBeenCalledOnce();
  unmount();
  expect(instances[1]?.close).toHaveBeenCalledOnce();
});
it("text selection clears collapsed selections", () => {
  const { result } = renderHook(() => useTextSelection());
  expect(result.current.text).toBe("");
  act(() => result.current.clear());
  expect(result.current.rect).toBeNull();
});
it("downloads blobs and cleans object URLs; HTTP failures never save files", async () => {
  vi.useFakeTimers();
  const create = vi.fn(() => "blob:test"),
    revoke = vi.fn();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: create,
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revoke,
  });
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {});
  const { result, unmount } = renderHook(() => useDownload());
  await act(async () => {
    await result.current.download(new Blob(["test"]), "test.txt");
  });
  expect(click).toHaveBeenCalledOnce();
  unmount();
  expect(revoke).toHaveBeenCalledWith("blob:test");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("oops", { status: 500 })),
  );
  const second = renderHook(() => useDownload());
  await act(async () => {
    await second.result.current.download("/bad", "bad.txt").catch(() => {});
  });
  expect(second.result.current.error).toMatchObject({
    message: "Download failed: HTTP 500",
  });
  expect(click).toHaveBeenCalledTimes(1);
});
it("drag/drop preserves text and tracks nested enter/leave", () => {
  const dropped = vi.fn();
  function Demo() {
    const drag = useDrag("hello");
    const drop = useDrop(dropped);
    return (
      <>
        <div {...drag.bind}>source</div>
        <div {...drop.bind}>{drop.over ? "over" : "target"}</div>
      </>
    );
  }
  render(<Demo />);
  const transfer = {
    types: ["text/plain"],
    files: [],
    setData: vi.fn(),
    getData: () => "hello",
    effectAllowed: "",
    dropEffect: "",
  };
  fireEvent.dragStart(screen.getByText("source"), { dataTransfer: transfer });
  expect(transfer.setData).toHaveBeenCalledWith("text/plain", "hello");
  const target = screen.getByText("target");
  fireEvent.dragEnter(target, { dataTransfer: transfer });
  fireEvent.dragEnter(target, { dataTransfer: transfer });
  fireEvent.dragLeave(target, { dataTransfer: transfer });
  expect(screen.getByText("over")).toBeTruthy();
  fireEvent.drop(target, { dataTransfer: transfer });
  expect(dropped).toHaveBeenCalledWith(
    { text: "hello", files: [] },
    expect.anything(),
  );
  expect(screen.getByText("target")).toBeTruthy();
});
