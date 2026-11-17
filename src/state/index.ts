import { useCallback, useRef, useState, type SetStateAction } from "react";

/** Holds the value from the latest render. Do not read refs while rendering UI. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
export function useMemoizedFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
) {
  const ref = useLatest(fn);
  return useCallback((...args: Args): Result => ref.current(...args), []);
}
export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, setValue, toggle, setTrue, setFalse };
}
export function useToggle<T>(first: T, second: T) {
  const [value, setValue] = useState<T>(first);
  const toggle = useMemoizedFn(() =>
    setValue((v) => (Object.is(v, first) ? second : first)),
  );
  return { value, setValue, toggle };
}
export function useSetState<T extends object>(initial: T | (() => T)) {
  const [state, update] = useState(initial);
  const setState = useCallback(
    (patch: Partial<T> | ((previous: T) => Partial<T>)) =>
      update((previous) => ({
        ...previous,
        ...(typeof patch === "function" ? patch(previous) : patch),
      })),
    [],
  );
  return [state, setState] as const;
}
export interface ControllableOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}
export function useControllableState<T>(options: ControllableOptions<T>) {
  const [internal, setInternal] = useState(options.defaultValue);
  const controlled = options.value !== undefined;
  const value = controlled ? (options.value as T) : internal;
  const current = useLatest(value);
  const setValue = useMemoizedFn((next: SetStateAction<T>) => {
    const resolved =
      typeof next === "function"
        ? (next as (previous: T) => T)(current.current)
        : next;
    if (Object.is(current.current, resolved)) return;
    if (!controlled) {
      current.current = resolved;
      setInternal(resolved);
    }
    options.onChange?.(resolved);
  });
  return [value, setValue] as const;
}
