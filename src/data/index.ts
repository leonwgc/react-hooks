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
export type RequestOptions<T, Args extends unknown[]> = {
  initialData?: T;
  pollingInterval?: number;
  onSuccess?: (data: T, args: Args) => void;
  onError?: (error: unknown, args: Args) => void;
} & (
  | { manual?: true; defaultParams?: Args }
  | { manual: false; defaultParams: Args }
);
export function useRequest<T, Args extends unknown[] = []>(
  service: RequestService<T, Args>,
  options: RequestOptions<T, Args> = {},
) {
  const [state, setState] = useState<{
    data: T | undefined;
    error: unknown;
    loading: boolean;
  }>({ data: options.initialData, error: undefined, loading: false });
  const [completed, setCompleted] = useState(0);
  const params = useRef<Args | undefined>(options.defaultParams);
  const sequence = useRef(0);
  const controller = useRef<AbortController | undefined>(undefined);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const mounted = useRef(true);
  const pollingStopped = useRef(false);
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
    if (mounted.current)
      setState((previous) => ({
        ...previous,
        loading: true,
        error: undefined,
      }));
    let data: T;
    try {
      data = await call({ signal: abort.signal }, ...args);
    } catch (error) {
      if (id !== sequence.current || abort.signal.aborted || !mounted.current)
        throw abortError();
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
    setState({ data, error: undefined, loading: false });
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
    if (
      !options.pollingInterval ||
      options.pollingInterval <= 0 ||
      state.loading ||
      !params.current ||
      pollingStopped.current
    )
      return;
    pollTimer.current = setTimeout(() => {
      if (!pollingStopped.current) refresh();
    }, options.pollingInterval);
    return () => clearTimeout(pollTimer.current);
  }, [options.pollingInterval, state.loading, completed, refresh]);
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
  },
) {
  const search = useSearch(options.initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: positive(options.pageSize ?? 10),
  });
  const [sort, updateSort] = useState<TableQuery<Filters>["sort"]>(null);
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
  );
  const { run } = request;
  useEffect(() => {
    run({ ...pagination, filters: search.submitted, sort });
  }, [pagination, search.submitted, search.revision, sort, run]);
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
    if (request.loading || !request.data) return;
    const last = Math.max(
      1,
      Math.ceil(request.data.total / pagination.pageSize),
    );
    if (pagination.page > last) setPagination((p) => ({ ...p, page: last }));
  }, [request.data, request.loading, pagination.page, pagination.pageSize]);
  return {
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
