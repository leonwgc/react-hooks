import { act, fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useLocalStorageState,
  useSessionStorageState,
  useUrlState,
  useOnline,
  usePageVisibility,
  useWindowSize,
  useMediaQuery,
  useEventListener,
  useClickOutside,
  useKeyPress,
  useClipboard,
  useScroll,
  useElementSize,
  useIntersectionObserver,
  useCountdown,
} from "../src";
describe("storage and URL", () => {
  it("loads saved data and synchronizes same-tab instances and functional writes", () => {
    localStorage.setItem("count", "4");
    const a = renderHook(() => useLocalStorageState("count", 0));
    const b = renderHook(() => useLocalStorageState("count", 0));
    expect(a.result.current.value).toBe(4);
    act(() => {
      a.result.current.setValue((n) => n + 1);
      b.result.current.setValue((n) => n + 1);
    });
    expect(a.result.current.value).toBe(6);
    expect(b.result.current.value).toBe(6);
    act(a.result.current.remove);
    expect(b.result.current.value).toBe(0);
  });
  it("responds to cross-tab storage and switches keys", () => {
    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorageState(key, "default"),
      { initialProps: { key: "a" } },
    );
    act(() => {
      localStorage.setItem("a", '"external"');
      window.dispatchEvent(
        new StorageEvent("storage", { key: "a", storageArea: localStorage }),
      );
    });
    expect(result.current.value).toBe("external");
    localStorage.setItem("b", '"second"');
    rerender({ key: "b" });
    expect(result.current.value).toBe("second");
  });
  it("reports corrupt data and failed writes without false success", () => {
    localStorage.setItem("bad", "{");
    const { result } = renderHook(() =>
      useLocalStorageState("bad", "fallback"),
    );
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.value).toBe("fallback");
    act(result.current.remove);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });
    act(() => result.current.setValue("new"));
    expect(result.current.error).toMatchObject({ name: "QuotaExceededError" });
    expect(result.current.value).toBe("fallback");
  });
  it("uses session storage independently", () => {
    const { result } = renderHook(() => useSessionStorageState("session", ""));
    act(() => result.current.setValue("draft"));
    expect(sessionStorage.getItem("session")).toBe('"draft"');
    expect(localStorage.getItem("session")).toBeNull();
  });
  it("preserves unrelated query, hash and history state and handles back navigation", () => {
    history.replaceState({ router: 1 }, "", "/?other=keep#/hooks");
    const { result } = renderHook(() => useUrlState({ q: "" }, "push"));
    act(() => result.current[1]({ q: "react hooks" }));
    expect(location.search).toContain("q=react+hooks");
    expect(location.hash).toBe("#/hooks");
    expect(history.state).toEqual({ router: 1 });
    act(() => result.current[1]({ q: null }));
    expect(location.search).toBe("?other=keep");
    act(() => {
      history.replaceState(null, "", "/?q=back");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(result.current[0].q).toBe("back");
  });
});
describe("browser subscriptions", () => {
  it("cleans event handlers and observes replaced nodes", () => {
    const a = document.createElement("button"),
      b = document.createElement("button"),
      callback = vi.fn();
    const ref = { current: a };
    const { rerender, unmount } = renderHook(() =>
      useEventListener("click", callback, ref),
    );
    fireEvent.click(a);
    expect(callback).toHaveBeenCalledTimes(1);
    ref.current = b;
    rerender();
    fireEvent.click(a);
    fireEvent.click(b);
    expect(callback).toHaveBeenCalledTimes(2);
    unmount();
    fireEvent.click(b);
    expect(callback).toHaveBeenCalledTimes(2);
  });
  it("detects outside pointers only and ignores typing shortcuts", () => {
    const node = document.createElement("div");
    document.body.append(node);
    const outside = vi.fn(),
      key = vi.fn();
    const { unmount } = renderHook(() => {
      useClickOutside(node, outside);
      useKeyPress("k", key);
    });
    fireEvent.pointerDown(node);
    expect(outside).not.toHaveBeenCalled();
    fireEvent.pointerDown(document.body);
    expect(outside).toHaveBeenCalledTimes(1);
    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { key: "k" });
    expect(key).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: "k" });
    expect(key).toHaveBeenCalledTimes(1);
    unmount();
    node.remove();
    input.remove();
  });
  it("updates viewport, online and visibility state from browser events", () => {
    const { result } = renderHook(() => ({
      size: useWindowSize(),
      online: useOnline(),
      visibility: usePageVisibility(),
    }));
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 700,
      });
      fireEvent(window, new Event("resize"));
    });
    expect(result.current.size.width).toBe(700);
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    act(() => window.dispatchEvent(new Event("offline")));
    expect(result.current.online).toBe(false);
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.visibility).toBe("hidden");
  });
  it("subscribes and unsubscribes media queries", () => {
    let notify: (() => void) | undefined;
    const media = {
      matches: false,
      addEventListener: vi.fn((_type: string, fn: () => void) => {
        notify = fn;
      }),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, "matchMedia").mockReturnValue(
      media as unknown as MediaQueryList,
    );
    const { result, unmount } = renderHook(() =>
      useMediaQuery("(min-width: 900px)"),
    );
    expect(result.current).toBe(false);
    act(() => {
      media.matches = true;
      notify?.();
    });
    expect(result.current).toBe(true);
    unmount();
    expect(media.removeEventListener).toHaveBeenCalled();
  });
  it("reports clipboard permissions and successful writes", async () => {
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error("denied"))
      .mockResolvedValueOnce(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      expect(await result.current.copy("hello")).toBe(false);
    });
    expect(result.current.error).toBeInstanceOf(Error);
    await act(async () => {
      expect(await result.current.copy("hello")).toBe(true);
    });
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeUndefined();
  });
  it("tracks element scroll position", () => {
    const node = document.createElement("div");
    const { result } = renderHook(() => useScroll(node));
    act(() => {
      node.scrollTop = 80;
      fireEvent.scroll(node);
    });
    expect(result.current.y).toBe(80);
  });
  it("observes element size and disconnects on unmount", () => {
    const disconnect = vi.fn(),
      observe = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );
    const node = document.createElement("div");
    vi.spyOn(node, "getBoundingClientRect").mockReturnValue({
      width: 200,
      height: 40,
    } as DOMRect);
    const { result, unmount } = renderHook(() => useElementSize(node));
    expect(result.current).toEqual({ width: 200, height: 40 });
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
  it("observes intersections without recreating on unrelated renders", () => {
    let callback!: IntersectionObserverCallback;
    const disconnect = vi.fn(),
      observe = vi.fn();
    const Constructor = vi.fn(
      class {
        constructor(fn: IntersectionObserverCallback) {
          callback = fn;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    vi.stubGlobal("IntersectionObserver", Constructor);
    const node = document.createElement("div");
    const { result, rerender, unmount } = renderHook(() =>
      useIntersectionObserver(node, { threshold: [0, 0.5] }),
    );
    act(() =>
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(result.current?.isIntersecting).toBe(true);
    rerender();
    expect(Constructor).toHaveBeenCalledTimes(1);
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
  it("counts down from real time and calls onEnd once", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    const onEnd = vi.fn();
    const { result, rerender, unmount } = renderHook(
      ({ target }: { target: number | null }) =>
        useCountdown(target, { onEnd }),
      { initialProps: { target: 3500 as number | null } },
    );
    expect(result.current.seconds).toBe(3);
    act(() => vi.advanceTimersByTime(2500));
    expect(result.current.finished).toBe(true);
    expect(onEnd).toHaveBeenCalledTimes(1);
    rerender({ target: 3500 });
    expect(onEnd).toHaveBeenCalledTimes(1);
    rerender({ target: null });
    expect(result.current.finished).toBe(false);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
