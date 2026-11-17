import { useEffect, useRef, useState, type DependencyList } from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { abortError, equal, isAbort } from "../internal/utils.js";

export interface RequestContext {
  signal: AbortSignal;
}
export type RequestService<T, Args extends unknown[]> = (
  context: RequestContext,
  ...args: Args
) => Promise<T>;
export class RequestTimeoutError extends Error {
  constructor(public timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.name = "TimeoutError";
  }
}
export type RequestOptions<T, Args extends unknown[]> = {
  initialData?: T;
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  retry?: number;
  retryDelay?: number | ((retryNumber: number, error: unknown) => number);
  shouldRetry?: (error: unknown, retryNumber: number, args: Args) => boolean;
  timeout?: number;
  refreshOnFocus?: boolean;
  refreshOnReconnect?: boolean;
  refreshThrottleInterval?: number;
  onSuccess?: (data: T, args: Args) => void;
  onError?: (error: unknown, args: Args) => void;
} & (
  | { manual?: true; defaultParams?: Args }
  | { manual: false; defaultParams: Args }
);

function waitForRetry(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const finish = () => {
      signal.removeEventListener("abort", abort);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    const abort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", abort);
      reject(abortError());
    };
    signal.addEventListener("abort", abort, { once: true });
  });
}
function requestAttempt<T>(
  run: (signal: AbortSignal) => Promise<T>,
  signal: AbortSignal,
  timeout?: number,
) {
  return new Promise<T>((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError());
      return;
    }
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cleanup = (removeParent = true) => {
      clearTimeout(timer);
      if (removeParent) signal.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      reject(abortError());
      controller.abort();
    };
    signal.addEventListener("abort", abort, { once: true });
    if (timeout && timeout > 0)
      timer = setTimeout(() => {
        cleanup();
        reject(new RequestTimeoutError(timeout));
        controller.abort();
      }, timeout);
    try {
      Promise.resolve(run(controller.signal)).then(
        (value) => {
          // Keep successful attempt signals linked until the next run/cancel/unmount.
          cleanup(false);
          resolve(value);
        },
        (error) => {
          cleanup();
          reject(error);
          controller.abort();
        },
      );
    } catch (error) {
      cleanup();
      reject(error);
      controller.abort();
    }
  });
}
export function useRequest<T, Args extends unknown[] = []>(
  service: RequestService<T, Args>,
  options: RequestOptions<T, Args> = {},
) {
  const [state, setState] = useState<{
    data: T | undefined;
    error: unknown;
    loading: boolean;
    retryCount: number;
  }>({
    data: options.initialData,
    error: undefined,
    loading: false,
    retryCount: 0,
  });
  const [completed, setCompleted] = useState(0);
  const [visible, setVisible] = useState(true);
  const params = useRef<Args | undefined>(options.defaultParams);
  const sequence = useRef(0);
  const controller = useRef<AbortController | undefined>(undefined);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const mounted = useRef(true);
  const pollingStopped = useRef(false);
  const busy = useRef(false);
  const lastAuto = useRef(-Infinity);
  const config = useLatest(options);
  const call = useMemoizedFn(service);
  const runAsync = useMemoizedFn(async (...args: Args): Promise<T> => {
    clearTimeout(pollTimer.current);
    const id = ++sequence.current;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    params.current = args;
    pollingStopped.current = false;
    busy.current = true;
    if (mounted.current)
      setState((previous) => ({
        ...previous,
        loading: true,
        error: undefined,
        retryCount: 0,
      }));
    let data: T;
    let retryCount = 0;
    try {
      for (;;) {
        try {
          data = await requestAttempt(
            (signal) => call({ signal }, ...args),
            abort.signal,
            config.current.timeout,
          );
          break;
        } catch (error) {
          if (
            abort.signal.aborted ||
            !mounted.current ||
            id !== sequence.current
          )
            throw abortError();
          const nextRetry = retryCount + 1;
          const maxRetries = Math.max(0, Math.floor(config.current.retry ?? 0));
          if (
            isAbort(error) ||
            !Number.isFinite(maxRetries) ||
            nextRetry > maxRetries ||
            config.current.shouldRetry?.(error, nextRetry, args) === false
          )
            throw error;
          retryCount = nextRetry;
          setState((previous) => ({ ...previous, retryCount }));
          const delay = config.current.retryDelay;
          const duration =
            typeof delay === "function"
              ? delay(retryCount, error)
              : (delay ?? Math.min(1000 * 2 ** (retryCount - 1), 30000));
          await waitForRetry(
            Number.isFinite(duration) ? Math.max(0, duration) : 1000,
            abort.signal,
          );
        }
      }
    } catch (error) {
      if (id !== sequence.current || abort.signal.aborted || !mounted.current)
        throw abortError();
      busy.current = false;
      setState((previous) => ({
        ...previous,
        error: isAbort(error) ? undefined : error,
        loading: false,
      }));
      setCompleted((n) => n + 1);
      if (!isAbort(error)) config.current.onError?.(error, args);
      throw error;
    }
    if (id !== sequence.current || abort.signal.aborted || !mounted.current)
      throw abortError();
    busy.current = false;
    setState({ data, error: undefined, loading: false, retryCount });
    setCompleted((n) => n + 1);
    config.current.onSuccess?.(data, args);
    return data;
  });
  const run = useMemoizedFn((...args: Args) => {
    void runAsync(...args).catch(() => {});
  });
  const cancel = useMemoizedFn(() => {
    clearTimeout(pollTimer.current);
    sequence.current++;
    controller.current?.abort();
    pollingStopped.current = true;
    busy.current = false;
    if (mounted.current)
      setState((previous) => ({ ...previous, loading: false }));
  });
  const refreshAsync = useMemoizedFn(() =>
    params.current
      ? runAsync(...params.current)
      : Promise.reject(new Error("No previous request parameters.")),
  );
  const refresh = useMemoizedFn(() => {
    void refreshAsync().catch(() => {});
  });
  const mutate = useMemoizedFn((data: T | ((previous: T | undefined) => T)) =>
    setState((previous) => ({
      ...previous,
      data:
        typeof data === "function"
          ? (data as (previous: T | undefined) => T)(previous.data)
          : data,
    })),
  );
  useEffect(() => {
    mounted.current = true;
    if (config.current.manual === false) run(...config.current.defaultParams);
    return () => {
      mounted.current = false;
      sequence.current++;
      controller.current?.abort();
      clearTimeout(pollTimer.current);
    };
  }, [config, run]);
  useEffect(() => {
    const autoRefresh = () => {
      if (
        !params.current ||
        busy.current ||
        pollingStopped.current ||
        document.visibilityState === "hidden"
      )
        return;
      const now = Date.now();
      if (
        now - lastAuto.current <
        (config.current.refreshThrottleInterval ?? 1000)
      )
        return;
      lastAuto.current = now;
      refresh();
    };
    const focus = () => {
      if (config.current.refreshOnFocus) autoRefresh();
    };
    const online = () => {
      if (config.current.refreshOnReconnect) autoRefresh();
    };
    const visibility = () => {
      const next = document.visibilityState !== "hidden";
      setVisible(next);
      if (next) focus();
    };
    setVisible(document.visibilityState !== "hidden");
    window.addEventListener("focus", focus);
    window.addEventListener("online", online);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("focus", focus);
      window.removeEventListener("online", online);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [config, refresh]);
  useEffect(() => {
    if (
      !options.pollingInterval ||
      options.pollingInterval <= 0 ||
      state.loading ||
      !params.current ||
      pollingStopped.current ||
      (!visible && options.pollingWhenHidden === false)
    )
      return;
    pollTimer.current = setTimeout(() => {
      if (
        !pollingStopped.current &&
        (config.current.pollingWhenHidden !== false ||
          document.visibilityState !== "hidden")
      )
        refresh();
    }, options.pollingInterval);
    return () => clearTimeout(pollTimer.current);
  }, [
    options.pollingInterval,
    options.pollingWhenHidden,
    visible,
    state.loading,
    completed,
    refresh,
    config,
  ]);
  return { ...state, run, runAsync, cancel, refresh, refreshAsync, mutate };
}

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}
const positive = (value: number, fallback = 1) =>
  Number.isFinite(value) ? Math.max(1, Math.floor(value)) : fallback;
export function usePagination(options: PaginationOptions = {}) {
  const [state, setState] = useState({
    page: positive(options.initialPage ?? 1),
    pageSize: positive(options.initialPageSize ?? 10),
  });
  const total =
    options.total === undefined ? undefined : Math.max(0, options.total);
  const pageCount =
    total === undefined
      ? undefined
      : Math.max(1, Math.ceil(total / state.pageSize));
  const page = Math.min(state.page, pageCount ?? Infinity);
  const setPage = useMemoizedFn((value: number) =>
    setState((previous) => ({
      ...previous,
      page: Math.min(positive(value), pageCount ?? Infinity),
    })),
  );
  const setPageSize = useMemoizedFn((value: number) =>
    setState({ page: 1, pageSize: positive(value, 10) }),
  );
  const reset = useMemoizedFn(() =>
    setState((previous) => ({ ...previous, page: 1 })),
  );
  return {
    page,
    pageSize: state.pageSize,
    pageCount,
    total,
    setPage,
    setPageSize,
    reset,
    next: useMemoizedFn(() => setPage(page + 1)),
    previous: useMemoizedFn(() => setPage(page - 1)),
  };
}
export function useSearch<T extends object>(initial: T) {
  const defaults = useRef(initial);
  const [draft, updateDraft] = useState(initial);
  const [submitted, updateSubmitted] = useState(initial);
  const [revision, setRevision] = useState(0);
  const draftRef = useLatest(draft);
  const setDraft = useMemoizedFn((patch: Partial<T>) => {
    const next = { ...draftRef.current, ...patch };
    draftRef.current = next;
    updateDraft(next);
  });
  const submit = useMemoizedFn(() => {
    updateSubmitted(draftRef.current);
    setRevision((n) => n + 1);
  });
  const reset = useMemoizedFn(() => {
    draftRef.current = defaults.current;
    updateDraft(defaults.current);
    updateSubmitted(defaults.current);
    setRevision((n) => n + 1);
  });
  return { draft, submitted, revision, setDraft, submit, reset };
}
export interface TableQuery<Filters> {
  page: number;
  pageSize: number;
  filters: Filters;
  sort: { field: string; order: "asc" | "desc" } | null;
}
export interface PageResult<T> {
  list: T[];
  total: number;
}
export function useTable<T, Filters extends object, Response = PageResult<T>>(
  service: RequestService<Response, [TableQuery<Filters>]>,
  options: {
    initialFilters: Filters;
    pageSize?: number;
    select: (response: Response) => PageResult<T>;
    urlState?: {
      key: string;
      mode?: "replace" | "push";
      parseFilters: (value: unknown) => Filters;
    };
    columns?: readonly string[];
    columnsStorageKey?: string;
    filterPresets?: Record<string, Filters>;
  },
) {
  const search = useSearch(options.initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: positive(options.pageSize ?? 10),
  });
  const [sort, updateSort] = useState<TableQuery<Filters>["sort"]>(null);
  const [stateError, setStateError] = useState<unknown>();
  const [urlReady, setUrlReady] = useState(!options.urlState);
  const hydrating = useRef(false);
  const appliedQuery = useRef<TableQuery<Filters> | null>(null);
  const tableOptions = useLatest(options);
  const query = { ...pagination, filters: search.submitted, sort };
  const queryRef = useLatest(query);
  const [columnState, updateColumns] = useState<{
    order: string[];
    hidden: string[];
  }>({ order: [...(options.columns ?? [])], hidden: [] });
  const columnRef = useLatest(columnState);
  const normalizeColumns = useMemoizedFn(
    (state: { order: readonly string[]; hidden: readonly string[] }) => {
      const keys = tableOptions.current.columns ?? [];
      return {
        order: [
          ...new Set([
            ...state.order.filter((key) => keys.includes(key)),
            ...keys,
          ]),
        ],
        hidden: [...new Set(state.hidden.filter((key) => keys.includes(key)))],
      };
    },
  );
  const persistColumns = useMemoizedFn(
    (next: { order: string[]; hidden: string[] }) => {
      columnRef.current = next;
      updateColumns(next);
      if (tableOptions.current.columnsStorageKey) {
        try {
          localStorage.setItem(
            tableOptions.current.columnsStorageKey,
            JSON.stringify(next),
          );
          setStateError(undefined);
        } catch (error) {
          setStateError(error);
        }
      }
    },
  );
  const setColumnOrder = useMemoizedFn((order: readonly string[]) =>
    persistColumns(normalizeColumns({ ...columnRef.current, order })),
  );
  const setColumnVisible = useMemoizedFn((key: string, visible: boolean) =>
    persistColumns(
      normalizeColumns({
        ...columnRef.current,
        hidden: visible
          ? columnRef.current.hidden.filter((value) => value !== key)
          : [...columnRef.current.hidden, key],
      }),
    ),
  );
  useEffect(() => {
    const storageKey = options.columnsStorageKey;
    try {
      const raw = storageKey ? localStorage.getItem(storageKey) : null;
      const decoded: unknown = raw
        ? JSON.parse(raw)
        : { order: options.columns ?? [], hidden: [] };
      if (
        !decoded ||
        typeof decoded !== "object" ||
        !("order" in decoded) ||
        !("hidden" in decoded) ||
        !Array.isArray(decoded.order) ||
        !Array.isArray(decoded.hidden) ||
        !decoded.order.every((key) => typeof key === "string") ||
        !decoded.hidden.every((key) => typeof key === "string")
      )
        throw new Error("Invalid saved column preferences.");
      updateColumns(
        normalizeColumns({ order: decoded.order, hidden: decoded.hidden }),
      );
      setStateError(undefined);
    } catch (error) {
      updateColumns(normalizeColumns({ order: [], hidden: [] }));
      setStateError(error);
    }
  }, [options.columnsStorageKey, normalizeColumns]);
  const [presets, setPresets] = useState<Record<string, Filters>>(
    options.filterPresets ?? {},
  );
  const savePreset = useMemoizedFn((name: string) => {
    if (name.trim())
      setPresets((previous) => ({ ...previous, [name]: search.draft }));
  });
  const deletePreset = useMemoizedFn((name: string) =>
    setPresets((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([key]) => key !== name),
      ),
    ),
  );
  const applyPreset = useMemoizedFn((name: string) => {
    const filters = Object.prototype.hasOwnProperty.call(presets, name)
      ? presets[name]
      : undefined;
    if (!filters) return false;
    search.setDraft(filters);
    search.submit();
    setPagination((p) => ({ ...p, page: 1 }));
    return true;
  });
  useEffect(() => {
    if (!options.urlState) {
      setUrlReady(true);
      return;
    }
    const read = () => {
      const config = tableOptions.current.urlState;
      if (!config) return;
      try {
        const raw = new URLSearchParams(window.location.search).get(config.key);
        let next: TableQuery<Filters> = {
          page: 1,
          pageSize: positive(tableOptions.current.pageSize ?? 10),
          filters: tableOptions.current.initialFilters,
          sort: null,
        };
        if (raw) {
          const value: unknown = JSON.parse(raw);
          if (!value || typeof value !== "object")
            throw new Error("Invalid table URL state.");
          const page =
            "page" in value && typeof value.page === "number"
              ? positive(value.page)
              : 1;
          const pageSize =
            "pageSize" in value && typeof value.pageSize === "number"
              ? positive(value.pageSize, 10)
              : next.pageSize;
          let sort: TableQuery<Filters>["sort"] = null;
          if (
            "sort" in value &&
            value.sort &&
            typeof value.sort === "object" &&
            "field" in value.sort &&
            typeof value.sort.field === "string" &&
            "order" in value.sort &&
            (value.sort.order === "asc" || value.sort.order === "desc")
          )
            sort = { field: value.sort.field, order: value.sort.order };
          next = {
            page,
            pageSize,
            sort,
            filters: config.parseFilters(
              "filters" in value ? value.filters : undefined,
            ),
          };
        }
        appliedQuery.current = next;
        hydrating.current = true;
        setPagination({ page: next.page, pageSize: next.pageSize });
        updateSort(next.sort);
        search.setDraft(next.filters);
        search.submit();
        setStateError(undefined);
      } catch (error) {
        setStateError(error);
      }
      setUrlReady(true);
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("web-hooks:url", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("web-hooks:url", read);
    };
  }, [options.urlState?.key, tableOptions, search.setDraft, search.submit]);
  useEffect(() => {
    const config = options.urlState;
    if (!config || !urlReady) return;
    if (hydrating.current) {
      hydrating.current = false;
      return;
    }
    if (equal(appliedQuery.current, queryRef.current)) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(config.key, JSON.stringify(queryRef.current));
      window.history[config.mode === "push" ? "pushState" : "replaceState"](
        window.history.state,
        "",
        url,
      );
      appliedQuery.current = queryRef.current;
    } catch (error) {
      setStateError(error);
    }
  }, [
    pagination,
    sort,
    search.submitted,
    urlReady,
    options.urlState?.key,
    options.urlState?.mode,
    queryRef,
  ]);

  const completedQuery = useRef<TableQuery<Filters> | null>(null);
  const request = useRequest<PageResult<T>, [TableQuery<Filters>]>(
    async (context, query) => {
      const result = options.select(await service(context, query));
      if (
        !Array.isArray(result.list) ||
        !Number.isFinite(result.total) ||
        result.total < 0
      )
        throw new TypeError(
          "Expected { list: T[], total: non-negative number }.",
        );
      return result;
    },
    {
      onSuccess: (_data, args) => {
        completedQuery.current = args[0];
      },
    },
  );
  const { run } = request;
  useEffect(() => {
    if (urlReady) run({ ...pagination, filters: search.submitted, sort });
  }, [pagination, search.submitted, search.revision, sort, run, urlReady]);
  const submit = useMemoizedFn(() => {
    setPagination((p) => ({ ...p, page: 1 }));
    search.submit();
  });
  const reset = useMemoizedFn(() => {
    setPagination((p) => ({ ...p, page: 1 }));
    updateSort(null);
    search.reset();
  });
  const setSort = useMemoizedFn((value: TableQuery<Filters>["sort"]) => {
    updateSort(value);
    setPagination((p) => ({ ...p, page: 1 }));
  });
  const setPage = useMemoizedFn((page: number) =>
    setPagination((p) => ({
      ...p,
      page: Math.min(
        positive(page),
        Math.max(
          1,
          Math.ceil((request.data?.total ?? page * p.pageSize) / p.pageSize),
        ),
      ),
    })),
  );
  const setPageSize = useMemoizedFn((pageSize: number) =>
    setPagination({ page: 1, pageSize: positive(pageSize, 10) }),
  );
  // Recover when deletion or external changes shrink the last page.
  useEffect(() => {
    if (
      request.loading ||
      !request.data ||
      !equal(completedQuery.current, queryRef.current)
    )
      return;
    const last = Math.max(
      1,
      Math.ceil(request.data.total / pagination.pageSize),
    );
    if (pagination.page > last) setPagination((p) => ({ ...p, page: last }));
  }, [request.data, request.loading, pagination.page, pagination.pageSize]);
  const normalizedColumns = normalizeColumns(columnState);
  return {
    stateError,
    columns: {
      ...normalizedColumns,
      visible: normalizedColumns.order.filter(
        (key) => !normalizedColumns.hidden.includes(key),
      ),
      setOrder: setColumnOrder,
      setVisible: setColumnVisible,
    },
    presets,
    savePreset,
    applyPreset,
    deletePreset,
    ...request,
    list: request.data?.list ?? [],
    total: request.data?.total ?? 0,
    ...pagination,
    sort,
    setSort,
    setPage,
    setPageSize,
    search: { ...search, submit, reset },
  };
}
export function useSelection<Key extends string | number>(
  keys: readonly Key[],
  options: { preserve?: boolean; resetKey?: unknown } = {},
) {
  const [stored, setStored] = useState<Set<Key>>(() => new Set());
  const previousReset = useRef(options.resetKey);
  const visibleKeys = new Set(keys);
  const resetting = !equal(previousReset.current, options.resetKey);
  const selected = resetting
    ? new Set<Key>()
    : new Set(
        [...stored].filter((key) => options.preserve || visibleKeys.has(key)),
      );
  const current = useLatest(selected);
  useEffect(() => {
    if (resetting) {
      previousReset.current = options.resetKey;
      setStored(new Set());
    } else if (!options.preserve)
      setStored((previous) =>
        [...previous].every((key) => visibleKeys.has(key))
          ? previous
          : new Set([...previous].filter((key) => visibleKeys.has(key))),
      );
  });
  const update = useMemoizedFn((fn: (previous: Set<Key>) => Set<Key>) => {
    const next = fn(current.current);
    current.current = next;
    setStored(next);
  });
  const toggle = useMemoizedFn((key: Key) =>
    update((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    }),
  );
  const selectAll = useMemoizedFn(() =>
    update((previous) => new Set([...previous, ...keys])),
  );
  const clear = useMemoizedFn(() => update(() => new Set()));
  const toggleAll = useMemoizedFn(() =>
    update((previous) => {
      const all = keys.length > 0 && keys.every((key) => previous.has(key));
      const next = new Set(previous);
      keys.forEach((key) => (all ? next.delete(key) : next.add(key)));
      return next;
    }),
  );
  const allSelected = keys.length > 0 && keys.every((key) => selected.has(key));
  return {
    selected,
    selectedKeys: [...selected],
    allSelected,
    partiallySelected: !allSelected && keys.some((key) => selected.has(key)),
    isSelected: (key: Key) => selected.has(key),
    toggle,
    selectAll,
    toggleAll,
    clear,
  };
}
