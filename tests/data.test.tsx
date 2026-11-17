import { act, renderHook, waitFor } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  useRequest,
  usePagination,
  useSearch,
  useTable,
  useSelection,
} from "../src";
const deferred = <T,>() => {
  let resolve!: (value: T) => void, reject!: (reason: unknown) => void;
  const promise = new Promise<T>((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};
describe("requests", () => {
  it("ignores stale success and stale errors even if the service ignores AbortSignal", async () => {
    const a = deferred<string>(),
      b = deferred<string>();
    const { result } = renderHook(() =>
      useRequest((_context, key: string) =>
        key === "a" ? a.promise : b.promise,
      ),
    );
    let first!: Promise<unknown>, second!: Promise<string>;
    act(() => {
      first = result.current.runAsync("a").catch((error) => error);
      second = result.current.runAsync("b");
    });
    await act(async () => {
      b.resolve("new");
      await second;
    });
    await act(async () => {
      a.resolve("old");
      await first;
    });
    expect(result.current.data).toBe("new");
    expect(await first).toMatchObject({ name: "AbortError" });
    expect(result.current.error).toBeUndefined();
  });
  it("passes abort signals and exposes errors for safe run calls", async () => {
    let signal!: AbortSignal;
    const pending = deferred<string>();
    const { result } = renderHook(() =>
      useRequest(async (context) => {
        signal = context.signal;
        return pending.promise;
      }),
    );
    act(() => result.current.run());
    act(result.current.cancel);
    expect(signal.aborted).toBe(true);
    expect(result.current.loading).toBe(false);
    await act(async () => {
      pending.resolve("ignored");
      await Promise.resolve();
    });
    expect(result.current.data).toBeUndefined();
    const failed = renderHook(() =>
      useRequest(async () => {
        throw new Error("failed");
      }),
    );
    act(() => failed.result.current.run());
    await waitFor(() =>
      expect(failed.result.current.error).toBeInstanceOf(Error),
    );
  });
  it("automatically requests, refreshes the last parameters, and aborts on unmount", async () => {
    const signals: AbortSignal[] = [];
    const service = vi.fn(
      async ({ signal }: { signal: AbortSignal }, id: number) => {
        signals.push(signal);
        return id * 2;
      },
    );
    const { result, unmount } = renderHook(() =>
      useRequest(service, { manual: false, defaultParams: [3] }),
    );
    await waitFor(() => expect(result.current.data).toBe(6));
    await act(async () => {
      await result.current.refreshAsync();
    });
    expect(service).toHaveBeenCalledTimes(2);
    unmount();
    expect(signals.at(-1)?.aborted).toBe(true);
  });
  it("survives Strict Mode replay without an obsolete result winning", async () => {
    const { result } = renderHook(
      () => useRequest(async () => "ok", { manual: false, defaultParams: [] }),
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <StrictMode>{children}</StrictMode>
        ),
      },
    );
    await waitFor(() => expect(result.current.data).toBe("ok"));
    expect(result.current.loading).toBe(false);
  });
  it("polls only after completion and cancel stops subsequent polling", async () => {
    vi.useFakeTimers();
    const service = vi.fn(async () => 1);
    const { result, unmount } = renderHook(() =>
      useRequest(service, { pollingInterval: 100 }),
    );
    await act(async () => {
      await result.current.runAsync();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(service).toHaveBeenCalledTimes(2);
    act(result.current.cancel);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(service).toHaveBeenCalledTimes(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
describe("lists", () => {
  it("clamps pages and resets after a page-size change", () => {
    const { result } = renderHook(() => usePagination({ total: 23 }));
    act(() => result.current.setPage(99));
    expect(result.current.page).toBe(3);
    act(() => result.current.setPageSize(20));
    expect(result.current.page).toBe(1);
    expect(result.current.pageCount).toBe(2);
  });
  it("keeps search drafts separate until submit, including batched edits", () => {
    const { result } = renderHook(() => useSearch({ q: "" }));
    act(() => result.current.setDraft({ q: "react" }));
    expect(result.current.submitted.q).toBe("");
    act(result.current.submit);
    expect(result.current.submitted.q).toBe("react");
    act(result.current.reset);
    expect(result.current.draft.q).toBe("");
    act(() => {
      result.current.setDraft({ q: "latest" });
      result.current.submit();
    });
    expect(result.current.submitted.q).toBe("latest");
  });
  it("combines search, pagination, response mapping, sorting and reset", async () => {
    const service = vi.fn(
      async (
        _context: unknown,
        query: { page: number; pageSize: number; filters: { q: string } },
      ) => ({ rows: [{ id: query.page, name: query.filters.q }], count: 50 }),
    );
    const { result } = renderHook(() =>
      useTable<
        { id: number; name: string },
        { q: string },
        { rows: { id: number; name: string }[]; count: number }
      >(service, {
        initialFilters: { q: "" },
        select: (response) => ({ list: response.rows, total: response.count }),
      }),
    );
    await waitFor(() => expect(result.current.total).toBe(50));
    act(() => result.current.setPage(3));
    await waitFor(() => expect(result.current.list[0]?.id).toBe(3));
    act(() => result.current.search.setDraft({ q: "react" }));
    expect(result.current.list[0]?.name).toBe("");
    act(result.current.search.submit);
    await waitFor(() => expect(result.current.list[0]?.name).toBe("react"));
    expect(result.current.page).toBe(1);
    act(() => {
      result.current.setPage(2);
      result.current.setSort({ field: "id", order: "desc" });
    });
    expect(result.current.page).toBe(1);
    act(result.current.search.reset);
    await waitFor(() => expect(result.current.list[0]?.name).toBe(""));
    expect(result.current.sort).toBeNull();
  });
  it("prunes page selections by default, preserves explicitly, and resets on filters", () => {
    const { result, rerender } = renderHook(
      ({ keys, preserve, query }) =>
        useSelection(keys, { preserve, resetKey: query }),
      { initialProps: { keys: [1, 2], preserve: false, query: "" } },
    );
    act(result.current.selectAll);
    expect(result.current.selectedKeys).toEqual([1, 2]);
    rerender({ keys: [3, 4], preserve: false, query: "" });
    expect(result.current.selectedKeys).toEqual([]);
    rerender({ keys: [1, 2], preserve: true, query: "" });
    act(() => result.current.toggle(1));
    rerender({ keys: [3, 4], preserve: true, query: "" });
    act(() => result.current.toggle(3));
    expect(result.current.selectedKeys).toEqual([1, 3]);
    rerender({ keys: [3, 4], preserve: true, query: "new" });
    expect(result.current.selectedKeys).toEqual([]);
  });
});
