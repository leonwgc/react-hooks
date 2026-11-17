import {
  useEffect,
  useLayoutEffect,
  useMemo,
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
    direction?: "append" | "prepend";
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
          let items =
            config.current.direction === "prepend"
              ? [...page.items, ...s.items]
              : [...s.items, ...page.items];
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

export interface VirtualListOptions<T> {
  itemHeight: number;
  height: number;
  overscan?: number;
  getKey: (item: T, index: number) => Key;
  dynamic?: boolean;
  onStartReached?: () => void;
  onEndReached?: () => void;
  threshold?: number;
}
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
export function useVirtualList<T>(
  items: readonly T[],
  options: VirtualListOptions<T>,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ top: 0, height: options.height });
  const [sizes, setSizes] = useState<Map<Key, number>>(() => new Map());
  const nodes = useRef(new Map<Key, HTMLElement>());
  const callbacks = useRef(new Map<Key, (node: HTMLElement | null) => void>());
  const observer = useRef<ResizeObserver | undefined>(undefined);
  const anchor = useRef<{ key: Key; offset: number } | null>(null);
  const config = useLatest(options);
  const geometry = useMemo(() => {
    const keys: Key[] = [];
    const offsets = [0];
    const indices = new Map<Key, number>();
    items.forEach((item, index) => {
      const key = options.getKey(item, index);
      keys.push(key);
      indices.set(key, index);
      offsets.push(
        offsets[index]! +
          ((options.dynamic ? sizes.get(key) : undefined) ??
            Math.max(1, options.itemHeight)),
      );
    });
    return { keys, offsets, indices, total: offsets.at(-1)! };
  }, [items, options.getKey, options.itemHeight, options.dynamic, sizes]);
  const geometryRef = useLatest(geometry);
  const findIndex = (offsets: number[], top: number) => {
    let low = 0,
      high = Math.max(0, offsets.length - 2);
    while (low < high) {
      const middle = Math.floor((low + high + 1) / 2);
      if (offsets[middle]! <= top) low = middle;
      else high = middle - 1;
    }
    return low;
  };
  const remember = useMemoizedFn((top: number) => {
    const data = geometryRef.current;
    const index = findIndex(data.offsets, top);
    const key = data.keys[index];
    anchor.current =
      key === undefined ? null : { key, offset: top - data.offsets[index]! };
  });
  const onScroll = useMemoizedFn(() => {
    const node = containerRef.current;
    if (!node) return;
    remember(node.scrollTop);
    setViewport((previous) => {
      const next = {
        top: node.scrollTop,
        height: node.clientHeight || config.current.height,
      };
      return previous.top === next.top && previous.height === next.height
        ? previous
        : next;
    });
  });
  const measure = useMemoizedFn((key: Key, node: HTMLElement) => {
    if (!config.current.dynamic) return;
    const height = node.getBoundingClientRect().height;
    if (height > 0)
      setSizes((previous) => {
        if (previous.get(key) === height) return previous;
        const next = new Map(previous);
        next.set(key, height);
        return next;
      });
  });
  const getMeasureRef = (key: Key) => {
    let callback = callbacks.current.get(key);
    if (!callback) {
      callback = (node) => {
        const old = nodes.current.get(key);
        if (old) observer.current?.unobserve(old);
        if (node) {
          nodes.current.set(key, node);
          measure(key, node);
          observer.current?.observe(node);
        } else nodes.current.delete(key);
      };
      callbacks.current.set(key, callback);
    }
    return callback;
  };
  useBrowserLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const saved = anchor.current;
    const index = saved ? geometry.indices.get(saved.key) : undefined;
    const requested =
      saved && index !== undefined
        ? geometry.offsets[index]! + saved.offset
        : node.scrollTop;
    const top = Math.max(
      0,
      Math.min(
        Math.max(0, geometry.total - (node.clientHeight || options.height)),
        requested,
      ),
    );
    if (node.scrollTop !== top) node.scrollTop = top;
    onScroll();
  }, [geometry, options.height, onScroll]);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (typeof ResizeObserver === "undefined") return;
    const instance = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === node) onScroll();
        else {
          for (const [key, element] of nodes.current)
            if (entry.target === element) {
              measure(key, element);
              break;
            }
        }
      }
    });
    observer.current = instance;
    instance.observe(node);
    for (const [key, element] of nodes.current) {
      measure(key, element);
      instance.observe(element);
    }
    return () => {
      instance.disconnect();
      observer.current = undefined;
    };
  }, [measure, onScroll, options.dynamic]);
  useEffect(() => {
    for (const key of callbacks.current.keys())
      if (!geometry.indices.has(key)) callbacks.current.delete(key);
    setSizes((previous) => {
      if ([...previous.keys()].every((key) => geometry.indices.has(key)))
        return previous;
      return new Map(
        [...previous].filter(([key]) => geometry.indices.has(key)),
      );
    });
  }, [geometry]);
  const edges = useRef({ start: "", end: "" });
  useEffect(() => {
    const threshold = Math.max(0, options.threshold ?? 40);
    const signature = `${items.length}:${geometry.total}`;
    const top = containerRef.current?.scrollTop ?? viewport.top;
    const height = containerRef.current?.clientHeight || viewport.height;
    if (top <= threshold) {
      if (edges.current.start !== signature) {
        edges.current.start = signature;
        config.current.onStartReached?.();
      }
    } else edges.current.start = "";
    if (top + height >= geometry.total - threshold) {
      if (edges.current.end !== signature) {
        edges.current.end = signature;
        config.current.onEndReached?.();
      }
    } else edges.current.end = "";
  }, [viewport, geometry.total, items.length, options.threshold, config]);
  const overscan = Math.max(0, Math.floor(options.overscan ?? 3));
  const start = Math.max(
    0,
    findIndex(geometry.offsets, viewport.top) - overscan,
  );
  const end = Math.min(
    items.length,
    findIndex(geometry.offsets, viewport.top + viewport.height) + 1 + overscan,
  );
  const scrollTo = useMemoizedFn(
    (index: number, align: "start" | "center" | "end" = "start") => {
      const node = containerRef.current;
      const data = geometryRef.current;
      if (!node || !data.keys.length) return;
      index = Math.max(0, Math.min(data.keys.length - 1, Math.floor(index)));
      const height = node.clientHeight || config.current.height;
      const itemHeight = data.offsets[index + 1]! - data.offsets[index]!;
      const offset =
        data.offsets[index]! -
        (align === "center"
          ? (height - itemHeight) / 2
          : align === "end"
            ? height - itemHeight
            : 0);
      node.scrollTop = Math.max(0, Math.min(data.total - height, offset));
      onScroll();
    },
  );
  const resetMeasurements = useMemoizedFn(() => {
    const measured = new Map<Key, number>();
    for (const [key, node] of nodes.current) {
      const height = node.getBoundingClientRect().height;
      if (height > 0) measured.set(key, height);
    }
    setSizes(measured);
  });
  return {
    containerRef,
    onScroll,
    containerStyle: {
      height: options.height,
      overflow: "auto",
      position: "relative",
      overflowAnchor: "none",
    } satisfies CSSProperties,
    totalHeight: geometry.total,
    scrollTo,
    resetMeasurements,
    virtualItems: items.slice(start, end).map((item, offset) => {
      const index = start + offset;
      const key = geometry.keys[index]!;
      return {
        item,
        index,
        key,
        measureRef: getMeasureRef(key),
        style: {
          position: "absolute",
          top: geometry.offsets[index],
          height: options.dynamic ? undefined : Math.max(1, options.itemHeight),
          width: "100%",
        } satisfies CSSProperties,
      };
    }),
  };
}
