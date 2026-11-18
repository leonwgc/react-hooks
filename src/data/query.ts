import { useCallback, useSyncExternalStore } from "react";
import { abortError } from "../internal/utils.js";

export interface QueryState<T> {
  data: T | undefined;
  error: unknown;
  status: "idle" | "pending" | "success" | "error";
  isFetching: boolean;
  updatedAt: number;
}
export interface QueryStore<T, Key extends string = string> {
  subscribe(key: Key, listener: () => void, enabled?: boolean): () => void;
  getSnapshot(key: Key): QueryState<T>;
  getServerSnapshot(): QueryState<T>;
  fetch(key: Key, force?: boolean): Promise<T>;
  invalidate(key?: Key): void;
  setData(key: Key, value: T | ((previous: T | undefined) => T)): void;
  cancel(key: Key): void;
  clear(): void;
}
export function createQueryStore<T, Key extends string = string>(
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
    state: QueryState<T>;
    cached?: { data: T };
    listeners: Map<() => void, boolean>;
    invalid: boolean;
    generation: number;
    controller?: AbortController;
    promise?: Promise<T>;
    timer?: ReturnType<typeof setTimeout>;
  }
  const entries = new Map<Key, Entry>();
  const duration = (value: number | undefined, fallback: number) =>
    value === undefined || Number.isNaN(value) ? fallback : Math.max(0, value);
  const staleTime = duration(options.staleTime, 30000);
  const cacheTime = duration(options.cacheTime, 300000);
  const entryFor = (key: Key) => {
    let entry = entries.get(key);
    if (!entry) {
      entry = {
        state: empty,
        listeners: new Map(),
        invalid: true,
        generation: 0,
      };
      entries.set(key, entry);
    }
    return entry;
  };
  const publish = (entry: Entry, state: QueryState<T>) => {
    entry.state = state;
    for (const listener of entry.listeners.keys()) listener();
  };
  const cancel = (key: Key) => {
    const entry = entries.get(key);
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
          return service({ signal: controller.signal }, key);
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
          if (entries.get(key) === entry && generation === entry.generation) {
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
          if (entries.get(key) === entry && generation === entry.generation)
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
          if (!entry.listeners.size && entries.get(key) === entry)
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
        if (!entry.listeners.size && entries.get(key) === entry) {
          cancel(key);
          entries.delete(key);
        }
      },
      Math.min(cacheTime, 2147483647),
    );
  };
  return {
    getSnapshot: (key) => entries.get(key)?.state ?? empty,
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
    invalidate(key) {
      const targets = key === undefined ? [...entries.keys()] : [key];
      for (const target of targets) {
        const entry = entries.get(target);
        if (!entry) continue;
        cancel(target);
        entry.invalid = true;
        if ([...entry.listeners.values()].some(Boolean))
          void fetch(target, true).catch(() => {});
        else if (!entry.listeners.size) expire(target, entry);
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
      const entry = entries.get(key);
      if (entry && !entry.listeners.size) expire(key, entry);
    },
    clear() {
      for (const [key, entry] of entries) {
        cancel(key);
        clearTimeout(entry.timer);
        entry.invalid = true;
        entry.cached = undefined;
        if (entry.listeners.size) publish(entry, empty);
        else entries.delete(key);
      }
    },
  };
}
export function useQuery<T, Key extends string>(
  store: QueryStore<T, Key>,
  key: Key | null,
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled !== false;
  const subscribe = useCallback(
    (listener: () => void) =>
      key === null ? () => {} : store.subscribe(key, listener, enabled),
    [store, key, enabled],
  );
  const snapshot = useCallback(
    () => (key === null ? store.getServerSnapshot() : store.getSnapshot(key)),
    [store, key],
  );
  const state = useSyncExternalStore(
    subscribe,
    snapshot,
    store.getServerSnapshot,
  );
  const refetch = useCallback(
    () =>
      key === null
        ? Promise.reject(new Error("Query key is null"))
        : store.fetch(key, true),
    [store, key],
  );
  const invalidate = useCallback(() => {
    if (key !== null) store.invalidate(key);
  }, [store, key]);
  const setData = useCallback(
    (value: T | ((previous: T | undefined) => T)) => {
      if (key !== null) store.setData(key, value);
    },
    [store, key],
  );
  const cancel = useCallback(() => {
    if (key !== null) store.cancel(key);
  }, [store, key]);
  return { ...state, refetch, invalidate, setData, cancel };
}
