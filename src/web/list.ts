import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Key,
} from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import {
  equal,
  abortError,
  type Target,
  resolveTarget,
} from "../internal/utils.js";

export interface InfinitePage<T, Cursor> {
  items: T[];
  nextCursor: Cursor | null;
}
export function useInfiniteScroll<T, Cursor>(
  service: (context: {
    signal: AbortSignal;
    cursor: Cursor;
  }) => Promise<InfinitePage<T, Cursor>>,
  options: {
    initialCursor: Cursor;
    manual?: boolean;
    resetKey?: unknown;
    getKey?: (item: T) => Key;
    sentinel?: Target<Element>;
  },
) {
  const [state, setState] = useState<{
    items: T[];
    loading: boolean;
    error: unknown;
    hasMore: boolean;
  }>({ items: [], loading: false, error: undefined, hasMore: true });
  const config = useLatest(options);
  const call = useMemoizedFn(service);
  const cursor = useRef<Cursor | null>(options.initialCursor);
  const sequence = useRef(0);
  const controller = useRef<AbortController | undefined>(undefined);
  const pending = useRef<Promise<void> | undefined>(undefined);
  const mounted = useRef(true);
  const loadMore = useMemoizedFn((): Promise<void> => {
    if (pending.current) return pending.current;
    if (cursor.current === null || !mounted.current) return Promise.resolve();
    const id = sequence.current;
    const abort = new AbortController();
    controller.current = abort;
    const requestedCursor = cursor.current;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    const promise = Promise.resolve()
      .then(() => call({ signal: abort.signal, cursor: requestedCursor }))
      .then((page) => {
        if (!mounted.current || id !== sequence.current || abort.signal.aborted)
          throw abortError();
        cursor.current = page.nextCursor;
        setState((s) => {
          let items = [...s.items, ...page.items];
          const getKey = config.current.getKey;
          if (getKey) {
            const seen = new Set<Key>();
            items = items.filter((item) => {
              const key = getKey(item);
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          }
          return {
            items,
            loading: false,
            error: undefined,
            hasMore: page.nextCursor !== null,
          };
        });
      })
      .catch((error) => {
        if (mounted.current && id === sequence.current)
          setState((s) => ({ ...s, loading: false, error }));
        throw error;
      })
      .finally(() => {
        if (pending.current === promise) pending.current = undefined;
      });
    pending.current = promise;
    void promise.catch(() => {});
    return promise;
  });
  const reset = useMemoizedFn(() => {
    sequence.current++;
    controller.current?.abort();
    pending.current = undefined;
    cursor.current = config.current.initialCursor;
    setState({ items: [], loading: false, error: undefined, hasMore: true });
    if (!config.current.manual) void loadMore();
  });
  const cancel = useMemoizedFn(() => {
    sequence.current++;
    controller.current?.abort();
    pending.current = undefined;
    setState((s) => ({ ...s, loading: false }));
  });
  const key = useRef(options.resetKey);
  const firstCursor = useRef(options.initialCursor);
  useEffect(() => {
    mounted.current = true;
    reset();
    return () => {
      mounted.current = false;
      sequence.current++;
      controller.current?.abort();
      pending.current = undefined;
    };
  }, [reset]);
  useEffect(() => {
    if (
      !equal(key.current, options.resetKey) ||
      !equal(firstCursor.current, options.initialCursor)
    ) {
      key.current = options.resetKey;
      firstCursor.current = options.initialCursor;
      reset();
    }
  }, [options.resetKey, options.initialCursor, reset]);
  useEffect(() => {
    const target = options.sentinel ? resolveTarget(options.sentinel) : null;
    if (
      !target ||
      typeof IntersectionObserver === "undefined" ||
      !state.hasMore ||
      state.loading ||
      state.error
    )
      return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    });
    observer.observe(target);
    return () => observer.disconnect();
  });
  return { ...state, loadMore, retry: loadMore, reset, cancel };
}

export function useVirtualList<T>(
  items: readonly T[],
  options: {
    itemHeight: number;
    height: number;
    overscan?: number;
    getKey: (item: T, index: number) => Key;
  },
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ top: 0, height: options.height });
  const rowHeight = Math.max(1, options.itemHeight);
  const overscan = Math.max(0, Math.floor(options.overscan ?? 3));
  const start = Math.max(
    0,
    Math.min(
      Math.max(0, items.length - 1),
      Math.floor(viewport.top / rowHeight) - overscan,
    ),
  );
  const end = Math.min(
    items.length,
    Math.ceil((viewport.top + viewport.height) / rowHeight) + overscan,
  );
  const totalHeight = items.length * rowHeight;
  const onScroll = useMemoizedFn(() => {
    const node = containerRef.current;
    if (node)
      setViewport({
        top: node.scrollTop,
        height: node.clientHeight || options.height,
      });
  });
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    onScroll();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(onScroll);
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [onScroll]);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const max = Math.max(
      0,
      totalHeight - (node.clientHeight || options.height),
    );
    if (node.scrollTop > max) node.scrollTop = max;
    onScroll();
  }, [totalHeight, options.height, onScroll]);
  const scrollTo = useMemoizedFn(
    (index: number, align: "start" | "center" | "end" = "start") => {
      const node = containerRef.current;
      if (!node) return;
      const height = node.clientHeight || options.height;
      const offset = Math.max(0, Math.min(items.length - 1, index)) * rowHeight;
      node.scrollTop = Math.max(
        0,
        Math.min(
          totalHeight - height,
          offset -
            (align === "center"
              ? (height - rowHeight) / 2
              : align === "end"
                ? height - rowHeight
                : 0),
        ),
      );
      onScroll();
    },
  );
  return {
    containerRef,
    onScroll,
    containerStyle: {
      height: options.height,
      overflow: "auto",
      position: "relative",
    } satisfies CSSProperties,
    totalHeight,
    scrollTo,
    virtualItems: items
      .slice(start, end)
      .map((item, offset) => ({
        item,
        index: start + offset,
        key: options.getKey(item, start + offset),
        style: {
          position: "absolute",
          top: (start + offset) * rowHeight,
          height: rowHeight,
          width: "100%",
        } satisfies CSSProperties,
      })),
  };
}
