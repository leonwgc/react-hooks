import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useBoolean,
  useToggle,
  useSetState,
  useControllableState,
  useLatest,
  useMemoizedFn,
  useDebounce,
  useDebounceFn,
  useThrottleFn,
  useInterval,
  useDisclosure,
  useEditor,
  useAsyncAction,
  useDirty,
  usePermission,
} from "../src";

describe("state and interactions", () => {
  it("toggles using fresh state during batched updates", () => {
    const { result } = renderHook(() => useBoolean());
    act(() => {
      result.current.toggle();
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
    act(result.current.setTrue);
    expect(result.current.value).toBe(true);
    act(result.current.setFalse);
    expect(result.current.value).toBe(false);
  });
  it("supports arbitrary toggle values", () => {
    const { result } = renderHook(() => useToggle("grid", "list"));
    act(result.current.toggle);
    expect(result.current.value).toBe("list");
  });
  it("shallow merges functional updates", () => {
    const { result } = renderHook(() => useSetState({ a: 1, b: 2 }));
    act(() => {
      result.current[1]((s) => ({ a: s.a + 1 }));
      result.current[1]((s) => ({ a: s.a + 1 }));
    });
    expect(result.current[0]).toEqual({ a: 3, b: 2 });
  });
  it("keeps controlled state owned by its caller", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 4 } },
    );
    act(() => result.current[1](6));
    expect(result.current[0]).toBe(4);
    expect(onChange).toHaveBeenCalledWith(6);
    rerender({ value: 6 });
    expect(result.current[0]).toBe(6);
  });
  it("accumulates uncontrolled updates", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 0 }),
    );
    act(() => {
      result.current[1]((n) => n + 1);
      result.current[1]((n) => n + 1);
    });
    expect(result.current[0]).toBe(2);
  });
  it("keeps latest refs and stable callbacks current", () => {
    const { result, rerender } = renderHook(
      ({ value }) => ({
        ref: useLatest(value),
        fn: useMemoizedFn(() => value),
      }),
      { initialProps: { value: 1 } },
    );
    const fn = result.current.fn,
      ref = result.current.ref;
    rerender({ value: 2 });
    expect(result.current.fn).toBe(fn);
    expect(result.current.ref).toBe(ref);
    expect(fn()).toBe(2);
    expect(ref.current).toBe(2);
  });
  it("opens and closes disclosures", () => {
    const { result } = renderHook(() => useDisclosure());
    act(result.current.open);
    expect(result.current.isOpen).toBe(true);
    act(result.current.close);
    expect(result.current.isOpen).toBe(false);
  });
  it("clears the previous editor record on create", () => {
    const { result } = renderHook(() => useEditor<{ id: number }>());
    act(() => result.current.edit({ id: 1 }));
    expect(result.current.mode).toBe("edit");
    act(result.current.close);
    expect(result.current.record?.id).toBe(1);
    act(result.current.create);
    expect(result.current.record).toBeNull();
  });
  it("shares the in-flight async action promise and recovers from errors", async () => {
    let resolve!: (value: number) => void;
    const action = vi.fn(
      () =>
        new Promise<number>((r) => {
          resolve = r;
        }),
    );
    const { result } = renderHook(() => useAsyncAction(action));
    let first!: Promise<number>, second!: Promise<number>;
    act(() => {
      first = result.current.run();
      second = result.current.run();
    });
    expect(first).toBe(second);
    await act(async () => {
      await Promise.resolve();
      resolve(42);
      await first;
    });
    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });
  it("detects immutable nested changes and resets the dirty baseline", () => {
    const { result, rerender } = renderHook(({ value }) => useDirty(value), {
      initialProps: { value: { nested: [1, 2] } },
    });
    rerender({ value: { nested: [1, 3] } });
    expect(result.current.isDirty).toBe(true);
    act(() => result.current.reset());
    expect(result.current.isDirty).toBe(false);
  });
  it("evaluates current permissions without implicit grants", () => {
    const { result, rerender } = renderHook(
      ({ permissions }) => usePermission(permissions),
      { initialProps: { permissions: ["read"] } },
    );
    expect(result.current.hasAll([])).toBe(true);
    expect(result.current.hasAny([])).toBe(false);
    expect(result.current.has("edit")).toBe(false);
    const has = result.current.has;
    rerender({ permissions: ["edit"] });
    expect(has("edit")).toBe(true);
    expect(result.current.hasAll(["read", "edit"])).toBe(false);
  });
});
describe("timers", () => {
  it("debounces the last value and cancels on unmount", () => {
    vi.useFakeTimers();
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: "a" } },
    );
    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(80));
    expect(result.current).toBe("a");
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("c");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("debounces calls, flushes once, and cancels pending work", () => {
    vi.useFakeTimers();
    const fn = vi.fn((n: number) => n * 2);
    const { result, unmount } = renderHook(() => useDebounceFn(fn, 100));
    act(() => {
      result.current.run(1);
      result.current.run(2);
    });
    expect(result.current.flush()).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
    act(() => {
      result.current.run(3);
      result.current.cancel();
      vi.advanceTimersByTime(200);
    });
    expect(fn).toHaveBeenCalledTimes(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("throttles leading and latest trailing calls", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottleFn(fn, 100));
    act(() => {
      result.current.run("a");
      result.current.run("b");
      result.current.run("c");
    });
    expect(fn.mock.calls).toEqual([["a"]]);
    act(() => vi.advanceTimersByTime(100));
    expect(fn.mock.calls).toEqual([["a"], ["c"]]);
    act(() => vi.advanceTimersByTime(200));
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it("pauses intervals and uses the latest callback", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ delay, value }: { delay: number | null; value: string }) =>
        useInterval(() => fn(value), delay),
      { initialProps: { delay: 100 as number | null, value: "a" } },
    );
    act(() => vi.advanceTimersByTime(100));
    rerender({ delay: 100, value: "b" });
    act(() => vi.advanceTimersByTime(100));
    expect(fn.mock.calls).toEqual([["a"], ["b"]]);
    rerender({ delay: null, value: "b" });
    act(() => vi.advanceTimersByTime(200));
    expect(fn).toHaveBeenCalledTimes(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
