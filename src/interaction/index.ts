import { useEffect, useRef, useState } from "react";
import { useBoolean, useMemoizedFn } from "../state/index.js";
import { equal } from "../internal/utils.js";
export function useDisclosure(initial = false) {
  const state = useBoolean(initial);
  return {
    isOpen: state.value,
    open: state.setTrue,
    close: state.setFalse,
    toggle: state.toggle,
  };
}
export function useEditor<T>() {
  const [state, setState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    record: T | null;
  }>({ isOpen: false, mode: "create", record: null });
  return {
    ...state,
    create: useMemoizedFn(() =>
      setState({ isOpen: true, mode: "create", record: null }),
    ),
    edit: useMemoizedFn((record: T) =>
      setState({ isOpen: true, mode: "edit", record }),
    ),
    close: useMemoizedFn(() =>
      setState((previous) => ({ ...previous, isOpen: false })),
    ),
  };
}
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const inFlight = useRef<Promise<Result> | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = useMemoizedFn((...args: Args): Promise<Result> => {
    if (inFlight.current) return inFlight.current;
    setLoading(true);
    setError(undefined);
    const promise = Promise.resolve()
      .then(() => action(...args))
      .catch((reason) => {
        if (mounted.current) setError(reason);
        throw reason;
      })
      .finally(() => {
        inFlight.current = null;
        if (mounted.current) setLoading(false);
      });
    inFlight.current = promise;
    return promise;
  });
  return { run, loading, error };
}
export function useDirty<T>(
  value: T,
  options: { initialValue?: T; isEqual?: (a: T, b: T) => boolean } = {},
) {
  const [baseline, setBaseline] = useState(() =>
    options.initialValue === undefined ? value : options.initialValue,
  );
  const reset = useMemoizedFn((next: T = value) => setBaseline(() => next));
  return {
    isDirty: !(options.isEqual ?? equal)(baseline, value),
    reset,
    baseline,
  };
}
export function usePermission(permissions: Iterable<string>) {
  const allowed = new Set(permissions);
  const has = useMemoizedFn((permission: string) => allowed.has(permission));
  const hasAll = useMemoizedFn((required: readonly string[]) =>
    required.every((permission) => allowed.has(permission)),
  );
  const hasAny = useMemoizedFn((required: readonly string[]) =>
    required.some((permission) => allowed.has(permission)),
  );
  return { has, hasAll, hasAny };
}
