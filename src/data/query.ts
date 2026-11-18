import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { abortError } from "../internal/utils.js";

export type QueryKeyPart =
  | string
  | number
  | boolean
  | null
  | readonly QueryKeyPart[]
  | { readonly [key: string]: QueryKeyPart };
export type QueryKey = string | readonly QueryKeyPart[];
// Canonical keys deliberately reject values that JSON would silently discard.
function keyHash(key: QueryKey): string {
  const seen = new Set<object>();
  const normalize = (value: QueryKeyPart): QueryKeyPart => {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    )
      return value;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value !== "object" || seen.has(value))
      throw new TypeError("Query keys must be finite, acyclic JSON values");
    seen.add(value);
    let result: QueryKeyPart;
    if (Array.isArray(value)) result = value.map(normalize);
    else {
      if (
        Object.getPrototypeOf(value) !== Object.prototype &&
        Object.getPrototypeOf(value) !== null
      )
        throw new TypeError("Query key objects must be plain objects");
      result = Object.fromEntries(
        Object.keys(value)
          .sort()
          .map((name) => [name, normalize(Reflect.get(value, name))]),
      );
    }
    seen.delete(value);
    return result;
  };
  return JSON.stringify(normalize(key));
}
export interface QueryState<T> {
  data: T | undefined;
  error: unknown;
  status: "idle" | "pending" | "success" | "error";
  isFetching: boolean;
  updatedAt: number;
}
export interface QueryStore<T, Key extends QueryKey = string> {
  subscribe(key: Key, listener: () => void, enabled?: boolean): () => void;
  getSnapshot(key: Key): QueryState<T>;
  getServerSnapshot(): QueryState<T>;
  fetch(key: Key, force?: boolean): Promise<T>;
  invalidate(key?: QueryKey, options?: { exact?: boolean }): void;
  setData(key: Key, value: T | ((previous: T | undefined) => T)): void;
  cancel(key: Key): void;
  clear(): void;
}
export function createQueryStore<T, Key extends QueryKey = string>(
  service: (context: { signal: AbortSignal }, key: Key) => Promise<T>,
  options: { staleTime?: number; cacheTime?: number } = {},
): QueryStore<T, Key> {
  const empty: QueryState<T> = {
    data: undefined,
    error: undefined,
    status: "idle",
    isFetching: false,
    updatedAt: 0,
  };
  interface Entry {
    key: Key;
    state: QueryState<T>;
    cached?: { data: T };
    listeners: Map<() => void, boolean>;
    invalid: boolean;
    generation: number;
    controller?: AbortController;
    promise?: Promise<T>;
    timer?: ReturnType<typeof setTimeout>;
  }
  const entries = new Map<string, Entry>();
  const duration = (value: number | undefined, fallback: number) =>
    value === undefined || Number.isNaN(value) ? fallback : Math.max(0, value);
  const staleTime = duration(options.staleTime, 30000);
  const cacheTime = duration(options.cacheTime, 300000);
  const entryFor = (key: Key) => {
    const hash = keyHash(key);
    let entry = entries.get(hash);
    if (!entry) {
      entry = {
        key: JSON.parse(hash) as Key,
        state: empty,
        listeners: new Map(),
        invalid: true,
        generation: 0,
      };
      entries.set(hash, entry);
    }
    return entry;
  };
  const publish = (entry: Entry, state: QueryState<T>) => {
    entry.state = state;
    for (const listener of entry.listeners.keys()) listener();
  };
  const cancel = (key: Key) => {
    const entry = entries.get(keyHash(key));
    if (!entry) return;
    entry.generation++;
    entry.controller?.abort();
    entry.controller = undefined;
    entry.promise = undefined;
    if (entry.state.isFetching)
      publish(entry, {
        ...entry.state,
        isFetching: false,
        status: entry.cached ? "success" : "idle",
        error: undefined,
      });
  };
  const fetch = (key: Key, force = false): Promise<T> => {
    const entry = entryFor(key);
    if (entry.promise) return entry.promise;
    if (
      !force &&
      !entry.invalid &&
      entry.cached &&
      entry.state.status === "success" &&
      Date.now() - entry.state.updatedAt < staleTime
    )
      return Promise.resolve(entry.cached.data);
    const controller = new AbortController();
    const generation = ++entry.generation;
    entry.controller = controller;
    // Install the promise before notifying subscribers so reentrant calls deduplicate.
    const promise = new Promise<T>((resolve, reject) => {
      const aborted = () => reject(abortError());
      controller.signal.addEventListener("abort", aborted, { once: true });
      Promise.resolve()
        .then(() => {
          if (controller.signal.aborted) throw abortError();
          return service({ signal: controller.signal }, entry.key);
        })
        .then(
          (value) => {
            controller.signal.removeEventListener("abort", aborted);
            resolve(value);
          },
          (error) => {
            controller.signal.removeEventListener("abort", aborted);
            reject(error);
          },
        );
    })
      .then(
        (value) => {
          if (
            entries.get(keyHash(key)) === entry &&
            generation === entry.generation
          ) {
            entry.invalid = false;
            entry.cached = { data: value };
            publish(entry, {
              data: value,
              error: undefined,
              status: "success",
              isFetching: false,
              updatedAt: Date.now(),
            });
          }
          return value;
        },
        (error) => {
          if (
            entries.get(keyHash(key)) === entry &&
            generation === entry.generation
          )
            publish(entry, {
              ...entry.state,
              error,
              status: "error",
              isFetching: false,
            });
          throw error;
        },
      )
      .finally(() => {
        if (generation === entry.generation) {
          entry.promise = undefined;
          entry.controller = undefined;
          if (!entry.listeners.size && entries.get(keyHash(key)) === entry)
            expire(key, entry);
        }
      });
    entry.promise = promise;
    publish(entry, {
      ...entry.state,
      error: undefined,
      status: entry.cached ? entry.state.status : "pending",
      isFetching: true,
    });
    return promise;
  };
  const expire = (key: Key, entry: Entry) => {
    clearTimeout(entry.timer);
    if (cacheTime === Infinity) return;
    entry.timer = setTimeout(
      () => {
        if (!entry.listeners.size && entries.get(keyHash(key)) === entry) {
          cancel(key);
          entries.delete(keyHash(key));
        }
      },
      Math.min(cacheTime, 2147483647),
    );
  };
  return {
    getSnapshot: (key) => entries.get(keyHash(key))?.state ?? empty,
    getServerSnapshot: () => empty,
    subscribe(key, listener, enabled = true) {
      const entry = entryFor(key);
      clearTimeout(entry.timer);
      entry.listeners.set(listener, enabled);
      if (enabled) void fetch(key).catch(() => {});
      return () => {
        entry.listeners.delete(listener);
        if (!entry.listeners.size) expire(key, entry);
      };
    },
    fetch,
    invalidate(key, { exact = true } = {}) {
      const hash = key === undefined ? undefined : keyHash(key);
      for (const [entryHash, entry] of entries) {
        const matches =
          hash === undefined ||
          (exact
            ? entryHash === hash
            : typeof key === "string"
              ? typeof entry.key === "string" && entry.key.startsWith(key)
              : Array.isArray(key) &&
                Array.isArray(entry.key) &&
                key.length <= entry.key.length &&
                key.every(
                  (part, index) =>
                    keyHash([part]) === keyHash([entry.key[index]]),
                ));
        if (!matches) continue;
        cancel(entry.key);
        entry.invalid = true;
        if ([...entry.listeners.values()].some(Boolean))
          void fetch(entry.key, true).catch(() => {});
        else if (!entry.listeners.size) expire(entry.key, entry);
      }
    },
    setData(key, value) {
      const entry = entryFor(key);
      const data =
        typeof value === "function"
          ? (value as (previous: T | undefined) => T)(entry.state.data)
          : value;
      cancel(key);
      entry.invalid = false;
      entry.cached = { data };
      publish(entry, {
        data,
        error: undefined,
        status: "success",
        isFetching: false,
        updatedAt: Date.now(),
      });
      if (!entry.listeners.size) expire(key, entry);
    },
    cancel(key) {
      cancel(key);
      const entry = entries.get(keyHash(key));
      if (entry && !entry.listeners.size) expire(key, entry);
    },
    clear() {
      for (const entry of entries.values()) {
        const key = entry.key;
        cancel(key);
        clearTimeout(entry.timer);
        entry.invalid = true;
        entry.cached = undefined;
        if (entry.listeners.size) publish(entry, empty);
        else entries.delete(keyHash(key));
      }
    },
  };
}
export interface QueryOptions<T, Selected = T> {
  enabled?: boolean;
  select?: (data: T) => Selected;
  isEqual?: (a: Selected | undefined, b: Selected | undefined) => boolean;
  notifyOnChangeProps?: readonly (keyof QueryState<Selected>)[];
  keepPreviousData?: boolean;
}
export function useQuery<T, Key extends QueryKey, Selected = T>(
  store: QueryStore<T, Key>,
  key: Key | null,
  options: QueryOptions<T, Selected> = {},
) {
  const hash = key === null ? null : keyHash(key);
  // Equivalent key objects should not tear down and recreate the subscription.
  const stableKey = useMemo(() => key, [hash]);
  const enabled = options.enabled !== false;
  const subscribe = useCallback(
    (listener: () => void) =>
      stableKey === null
        ? () => {}
        : store.subscribe(stableKey, listener, enabled),
    [store, stableKey, enabled],
  );
  const cache = useRef<{
    store: QueryStore<T, Key>;
    hash: string | null;
    raw: QueryState<T>;
    select: typeof options.select;
    isEqual: typeof options.isEqual;
    notify: typeof options.notifyOnChangeProps;
    snapshot: QueryState<Selected>;
  } | null>(null);
  const snapshot = useCallback(() => {
    const raw =
      stableKey === null
        ? store.getServerSnapshot()
        : store.getSnapshot(stableKey);
    const previous = cache.current;
    if (
      previous?.store === store &&
      previous.hash === hash &&
      previous.raw === raw &&
      previous.select === options.select &&
      previous.isEqual === options.isEqual &&
      previous.notify === options.notifyOnChangeProps
    )
      return previous.snapshot;
    const data =
      raw.data === undefined
        ? undefined
        : options.select
          ? options.select(raw.data)
          : (raw.data as unknown as Selected);
    let next: QueryState<Selected> = { ...raw, data };
    const fields = options.notifyOnChangeProps ?? [
      "data",
      "error",
      "status",
      "isFetching",
      "updatedAt",
    ];
    if (
      previous?.store === store &&
      previous.hash === hash &&
      fields.every((field) =>
        field === "data"
          ? (options.isEqual ?? Object.is)(previous.snapshot.data, next.data)
          : Object.is(previous.snapshot[field], next[field]),
      )
    )
      next = previous.snapshot;
    cache.current = {
      store,
      hash,
      raw,
      select: options.select,
      isEqual: options.isEqual,
      notify: options.notifyOnChangeProps,
      snapshot: next,
    };
    return next;
  }, [
    store,
    stableKey,
    hash,
    options.select,
    options.isEqual,
    options.notifyOnChangeProps,
  ]);
  const server = useCallback(
    () => store.getServerSnapshot() as unknown as QueryState<Selected>,
    [store],
  );
  const state = useSyncExternalStore(subscribe, snapshot, server);
  const previousData = useRef<{
    store: QueryStore<T, Key>;
    data: Selected;
  } | null>(null);
  const isPreviousData = !!(
    options.keepPreviousData &&
    stableKey !== null &&
    state.data === undefined &&
    previousData.current?.store === store
  );
  const data = isPreviousData ? previousData.current!.data : state.data;
  useEffect(() => {
    if (stableKey === null || previousData.current?.store !== store)
      previousData.current = null;
    if (stableKey !== null && state.data !== undefined)
      previousData.current = { store, data: state.data };
  }, [store, stableKey, state.data]);
  const refetch = useCallback(
    () =>
      stableKey === null
        ? Promise.reject(new Error("Query key is null"))
        : store.fetch(stableKey, true),
    [store, stableKey],
  );
  const invalidate = useCallback(() => {
    if (stableKey !== null) store.invalidate(stableKey);
  }, [store, stableKey]);
  const setData = useCallback(
    (value: T | ((previous: T | undefined) => T)) => {
      if (stableKey !== null) store.setData(stableKey, value);
    },
    [store, stableKey],
  );
  const cancel = useCallback(() => {
    if (stableKey !== null) store.cancel(stableKey);
  }, [store, stableKey]);
  return {
    ...state,
    data,
    isPreviousData,
    refetch,
    invalidate,
    setData,
    cancel,
  };
}
