import { act, renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useAnimate, useRafLoop, useReducedMotion } from "../src";
it("starts, stops, and cleans RAF loops with elapsed frame time", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let id = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => frames.delete(key));
  const callback = vi.fn();
  const { result, unmount } = renderHook(() => useRafLoop(callback, false));
  act(result.current.start);
  const tick = (time: number) => {
    const [key, frame] = [...frames][0];
    frames.delete(key);
    act(() => frame(time));
  };
  tick(100);
  tick(116);
  expect(callback.mock.calls.map(([frame]) => frame.delta)).toEqual([0, 16]);
  act(result.current.stop);
  expect(frames.size).toBe(0);
  act(result.current.start);
  unmount();
  expect(frames.size).toBe(0);
  vi.unstubAllGlobals();
});
it("cancels previous animations, supports controls, and cleans on unmount", () => {
  const create = () => ({
    cancel: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    finish: vi.fn(),
    effect: { updateTiming: vi.fn() },
    onfinish: null as (() => void) | null,
    oncancel: null as (() => void) | null,
  });
  const a = create(),
    b = create();
  const element = document.createElement("div");
  const animate = vi.fn().mockReturnValueOnce(a).mockReturnValueOnce(b);
  element.animate = animate;
  const { result, unmount } = renderHook(() => useAnimate(element));
  act(() => {
    result.current.play([{ opacity: 0 }, { opacity: 1 }]);
  });
  expect(result.current.status).toBe("running");
  act(result.current.pause);
  expect(a.pause).toHaveBeenCalled();
  expect(result.current.status).toBe("paused");
  act(result.current.resume);
  act(result.current.reverse);
  expect(a.reverse).toHaveBeenCalled();
  act(() => {
    result.current.play([{ opacity: 1 }]);
  });
  expect(a.cancel).toHaveBeenCalled();
  act(() => b.onfinish?.());
  expect(result.current.status).toBe("finished");
  unmount();
  expect(b.cancel).toHaveBeenCalled();
});
it("respects reduced motion and returns null if animation is unavailable", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as MediaQueryList);
  const animation = {
    cancel: vi.fn(),
    finish: vi.fn(),
    effect: { updateTiming: vi.fn() },
  };
  const node = document.createElement("div");
  node.animate = vi.fn().mockReturnValue(animation);
  const { result } = renderHook(() => ({
    reduced: useReducedMotion(),
    animation: useAnimate(node),
  }));
  expect(result.current.reduced).toBe(true);
  act(() => {
    result.current.animation.play([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay: 300,
      iterations: Infinity,
    });
  });
  expect(node.animate).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ duration: 0, delay: 0, iterations: 1 }),
  );
  const absent = renderHook(() => useAnimate(null));
  let returned: unknown;
  act(() => {
    returned = absent.result.current.play([]);
  });
  expect(returned).toBeNull();
});
