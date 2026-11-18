import {
  act,
  renderHook,
  waitFor,
  render,
  fireEvent,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StrictMode, useRef } from "react";
import {
  createQueryStore,
  useQuery,
  useSteps,
  useDocumentTitle,
  useObjectURL,
  useTextareaAutoSize,
  useSpring,
  useTransitionState,
  useGesture,
} from "../src";
afterEach(() => vi.unstubAllGlobals());
it("shares query results, deduplicates subscribers, invalidates and isolates stores", async () => {
  const service = vi.fn(async () => ({ count: 1 }));
  const store = createQueryStore(service, { cacheTime: 0 });
  const a = renderHook(() => useQuery(store, "a"), { wrapper: StrictMode });
  const b = renderHook(() => useQuery(store, "a"));
  await waitFor(() => expect(a.result.current.status).toBe("success"));
  expect(service).toHaveBeenCalledTimes(1);
  expect(b.result.current.data).toEqual({ count: 1 });
  act(() => a.result.current.setData({ count: 2 }));
  expect(b.result.current.data).toEqual({ count: 2 });
  act(() => b.result.current.invalidate());
  await waitFor(() => expect(service).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(a.result.current.isFetching).toBe(false));
  const other = createQueryStore(async () => ({ count: 9 }));
  await other.fetch("a");
  expect(other.getSnapshot("a").data).toEqual({ count: 9 });
  expect(store.getSnapshot("a").data).toEqual({ count: 1 });
  a.unmount();
  b.unmount();
  store.clear();
  other.clear();
});
it("cancels uncooperative queries and prevents old responses replacing local updates", async () => {
  let resolve!: (value: string) => void;
  const store = createQueryStore(
    () => new Promise<string>((r) => (resolve = r)),
  );
  const promise = store.fetch("a").catch((error) => error);
  await Promise.resolve();
  store.setData("a", "local");
  expect(await promise).toMatchObject({ name: "AbortError" });
  resolve("old");
  await Promise.resolve();
  expect(store.getSnapshot("a").data).toBe("local");
  store.clear();
});
it("keeps disabled queries idle, separates keys and expires inactive cached data", async () => {
  vi.useFakeTimers();
  const service = vi.fn(async (_context, key: string) => key);
  const store = createQueryStore(service, { staleTime: 100, cacheTime: 50 });
  const hook = renderHook(
    ({ key, enabled }) => useQuery(store, key, { enabled }),
    { initialProps: { key: "a", enabled: false } },
  );
  expect(service).not.toHaveBeenCalled();
  await act(async () => {
    await hook.result.current.refetch();
  });
  expect(hook.result.current.data).toBe("a");
  hook.rerender({ key: "b", enabled: true });
  await act(async () => {});
  expect(hook.result.current.data).toBe("b");
  await act(async () => {
    await vi.advanceTimersByTimeAsync(51);
  });
  expect(store.getSnapshot("a").status).toBe("idle");
  hook.unmount();
  store.clear();
});
it("reports query errors, retries manually and respects freshness", async () => {
  const service = vi
    .fn()
    .mockRejectedValueOnce(Error("offline"))
    .mockResolvedValue("ok");
  const store = createQueryStore<string>(service);
  const hook = renderHook(() => useQuery(store, "key"));
  await waitFor(() => expect(hook.result.current.status).toBe("error"));
  await act(async () => {
    await hook.result.current.refetch();
  });
  await store.fetch("key");
  expect(service).toHaveBeenCalledTimes(2);
  expect(hook.result.current.error).toBeUndefined();
  hook.unmount();
  store.clear();
});
it("reclaims inactive entries after cancel and invalidate", async () => {
  vi.useFakeTimers();
  const store = createQueryStore(() => new Promise<string>(() => {}), {
    cacheTime: 10,
  });
  store.setData("cancelled", "old");
  const cancelled = store.fetch("cancelled", true).catch((error) => error);
  store.cancel("cancelled");
  expect(await cancelled).toMatchObject({ name: "AbortError" });
  store.setData("invalidated", "old");
  store.invalidate("invalidated");
  await vi.advanceTimersByTimeAsync(11);
  expect(store.getSnapshot("cancelled").data).toBeUndefined();
  expect(store.getSnapshot("invalidated").data).toBeUndefined();
  store.clear();
});
it("steps validate forward moves, bypass validation backwards and ignore superseded results", async () => {
  let resolve!: (value: boolean) => void;
  const validate = vi.fn(() => new Promise<boolean>((r) => (resolve = r)));
  const { result, rerender } = renderHook(
    ({ count }) => useSteps({ count, validate }),
    { initialProps: { count: 4 } },
  );
  let pending!: Promise<boolean>;
  act(() => {
    pending = result.current.next();
  });
  expect(result.current.validating).toBe(true);
  act(() => result.current.reset(2));
  await act(async () => resolve(true));
  expect(await pending).toBe(false);
  expect(result.current.step).toBe(2);
  await act(async () => {
    await result.current.previous();
  });
  expect(result.current.step).toBe(1);
  expect(validate).toHaveBeenCalledTimes(1);
  act(() => {
    pending = result.current.next();
  });
  await act(async () => resolve(false));
  expect(await pending).toBe(false);
  expect(result.current.step).toBe(1);
  act(() => {
    pending = result.current.next();
  });
  await act(async () => resolve(true));
  expect(await pending).toBe(true);
  expect(result.current.completed).toEqual([1]);
  rerender({ count: 1 });
  expect(result.current.step).toBe(0);
  expect(result.current.isLast).toBe(true);
});
it("title ownership restores the remaining owner and original title", () => {
  document.title = "Original";
  const a = renderHook(({ title }) => useDocumentTitle(title), {
    initialProps: { title: "Parent" },
  });
  const b = renderHook(() => useDocumentTitle("Child"));
  a.rerender({ title: "Updated parent" });
  expect(document.title).toBe("Child");
  b.unmount();
  expect(document.title).toBe("Updated parent");
  a.unmount();
  expect(document.title).toBe("Original");
  const c = renderHook(() => useDocumentTitle("Managed"));
  document.title = "External";
  c.unmount();
  expect(document.title).toBe("External");
});
it("revokes object URLs on replace and unmount and handles unsupported environments", () => {
  const create = vi
    .fn()
    .mockReturnValueOnce("blob:a")
    .mockReturnValueOnce("blob:b");
  const revoke = vi.fn();
  vi.stubGlobal("URL", { createObjectURL: create, revokeObjectURL: revoke });
  const a = new Blob(["a"]),
    b = new Blob(["b"]);
  const hook = renderHook(({ file }) => useObjectURL(file), {
    initialProps: { file: a },
  });
  expect(hook.result.current.url).toBe("blob:a");
  hook.rerender({ file: b });
  expect(revoke).toHaveBeenCalledWith("blob:a");
  expect(hook.result.current.url).toBe("blob:b");
  hook.unmount();
  expect(revoke).toHaveBeenCalledWith("blob:b");
  vi.stubGlobal("URL", {});
  const unavailable = renderHook(() => useObjectURL(a));
  expect(unavailable.result.current.supported).toBe(false);
  expect(unavailable.result.current.url).toBeNull();
});
it("autosizes content-box textareas, clamps rows and restores inline styles", () => {
  const node = document.createElement("textarea");
  node.style.cssText =
    "height:33px;overflow-y:scroll;line-height:20px;padding:4px;box-sizing:content-box";
  document.body.append(node);
  Object.defineProperty(node, "scrollHeight", {
    configurable: true,
    value: 108,
  });
  const hook = renderHook(
    ({ max }) =>
      useTextareaAutoSize(node, "text", { minRows: 2, maxRows: max }),
    { initialProps: { max: 3 } },
  );
  expect(hook.result.current.height).toBe(60);
  expect(node.style.overflowY).toBe("auto");
  hook.rerender({ max: 8 });
  expect(hook.result.current.height).toBe(100);
  expect(node.style.overflowY).toBe("hidden");
  hook.unmount();
  expect(node.style.height).toBe("33px");
  expect(node.style.overflowY).toBe("scroll");
  node.remove();
});
it("spring converges, can stop and restart, and releases animation frames", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++id, fn);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  const { result, rerender, unmount } = renderHook(
    ({ target }) => useSpring(target, { initialValue: 0 }),
    { initialProps: { target: 100 } },
  );
  for (let time = 0; time < 6000 && frames.size; time += 16) {
    const [key, fn] = [...frames][0];
    frames.delete(key);
    act(() => fn(time));
  }
  expect(result.current.value).toBe(100);
  expect(result.current.animating).toBe(false);
  rerender({ target: 200 });
  act(result.current.stop);
  expect(frames.size).toBe(0);
  act(result.current.restart);
  expect(frames.size).toBe(1);
  act(result.current.finish);
  expect(result.current.value).toBe(200);
  unmount();
  expect(frames.size).toBe(0);
});
it("autosizes a conditionally mounted ref target and restores disabled styles", () => {
  function Demo({ shown, enabled }: { shown: boolean; enabled: boolean }) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const size = useTextareaAutoSize(ref, "", { minRows: 3, enabled });
    return (
      <>
        {shown && (
          <textarea
            ref={ref}
            style={{ height: 40, lineHeight: "20px", padding: 0, border: 0 }}
          />
        )}
        <output>{size.height}</output>
      </>
    );
  }
  const view = render(<Demo shown={false} enabled />);
  expect(view.container.querySelector("output")?.textContent).toBe("0");
  view.rerender(<Demo shown enabled />);
  expect(view.container.querySelector("textarea")?.style.height).toBe("60px");
  view.rerender(<Demo shown enabled={false} />);
  expect(view.container.querySelector("textarea")?.style.height).toBe("40px");
  expect(view.container.querySelector("output")?.textContent).toBe("0");
  view.rerender(<Demo shown={false} enabled />);
  expect(view.container.querySelector("output")?.textContent).toBe("0");
});
it("reduced motion completes springs and transitions without leaving scheduled work", () => {
  vi.useFakeTimers();
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = (query) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: () => true,
  });
  const spring = renderHook(() => useSpring(100, { initialValue: 0 }));
  const transition = renderHook(
    ({ open }) => useTransitionState(open, { appear: true }),
    { initialProps: { open: true } },
  );
  expect(spring.result.current.value).toBe(100);
  expect(spring.result.current.animating).toBe(false);
  expect(transition.result.current.phase).toBe("entered");
  transition.rerender({ open: false });
  expect(transition.result.current.mounted).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
  window.matchMedia = originalMatchMedia;
});
it("transitions retain exiting content and cancel stale exit timers when reopened", () => {
  vi.useFakeTimers();
  const { result, rerender, unmount } = renderHook(
    ({ open }) =>
      useTransitionState(open, { enterDuration: 100, exitDuration: 200 }),
    { initialProps: { open: false } },
  );
  rerender({ open: true });
  expect(result.current.phase).toBe("entering");
  act(() => vi.advanceTimersByTime(100));
  expect(result.current.phase).toBe("entered");
  rerender({ open: false });
  expect(result.current.mounted).toBe(true);
  act(() => vi.advanceTimersByTime(50));
  rerender({ open: true });
  act(() => vi.advanceTimersByTime(250));
  expect(result.current.phase).toBe("entered");
  rerender({ open: false });
  act(() => vi.advanceTimersByTime(200));
  expect(result.current.mounted).toBe(false);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it("gesture works without callbacks, constrains axis, detects swipe and cancels", () => {
  vi.stubGlobal("PointerEvent", MouseEvent);
  function Demo() {
    const g = useGesture({ axis: "x" });
    return (
      <div>
        <div data-testid="pad" {...g.bind} />
        <output>
          {JSON.stringify({
            active: g.active,
            x: g.offset.x,
            y: g.offset.y,
            swipe: g.swipe,
          })}
        </output>
        <button onClick={g.cancel}>cancel</button>
      </div>
    );
  }
  const { getByTestId, container, getByText } = render(<Demo />);
  const pad = getByTestId("pad");
  fireEvent.pointerDown(pad, { button: 0, clientX: 10, clientY: 10 });
  fireEvent.pointerMove(pad, { clientX: 90, clientY: 70 });
  expect(container.querySelector("output")?.textContent).toContain(
    '"x":80,"y":0',
  );
  fireEvent.pointerUp(pad, { clientX: 90, clientY: 70 });
  expect(container.querySelector("output")?.textContent).toContain(
    '"swipe":"right"',
  );
  fireEvent.pointerDown(pad, { button: 0, clientX: 0, clientY: 0 });
  fireEvent.click(getByText("cancel"));
  expect(container.querySelector("output")?.textContent).toContain(
    '"active":false',
  );
});
