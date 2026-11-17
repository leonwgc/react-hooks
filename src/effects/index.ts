import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "../state/index.js";

export function useDebounceFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  wait = 300,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const args = useRef<Args | undefined>(undefined);
  const invoke = useMemoizedFn(fn);
  const cancel = useMemoizedFn(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    args.current = undefined;
  });
  const flush = useMemoizedFn((): Result | undefined => {
    const pending = args.current;
    cancel();
    return pending ? invoke(...pending) : undefined;
  });
  const run = useMemoizedFn((...next: Args) => {
    cancel();
    args.current = next;
    timer.current = setTimeout(flush, Math.max(0, wait));
  });
  useEffect(() => cancel, [cancel, wait]);
  return { run, cancel, flush };
}
export function useDebounce<T>(value: T, wait = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), Math.max(0, wait));
    return () => clearTimeout(timer);
  }, [value, wait]);
  return debounced;
}
export function useThrottleFn<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  wait = 300,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const last = useRef<number | undefined>(undefined);
  const pending = useRef<Args | undefined>(undefined);
  const invoke = useMemoizedFn(fn);
  const cancel = useMemoizedFn(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
    pending.current = undefined;
    last.current = undefined;
  });
  const flush = useMemoizedFn((): Result | undefined => {
    clearTimeout(timer.current);
    timer.current = undefined;
    const args = pending.current;
    pending.current = undefined;
    if (args) {
      last.current = Date.now();
      return invoke(...args);
    }
  });
  const run = useMemoizedFn((...args: Args): Result | undefined => {
    const remaining =
      last.current === undefined
        ? 0
        : Math.max(0, wait) - (Date.now() - last.current);
    pending.current = args;
    if (remaining <= 0) return flush();
    if (timer.current === undefined)
      timer.current = setTimeout(flush, remaining);
  });
  useEffect(() => cancel, [cancel, wait]);
  return { run, cancel, flush };
}
export function useInterval(
  callback: () => void,
  delay: number | null,
  immediate = false,
) {
  const invoke = useMemoizedFn(callback);
  useEffect(() => {
    if (delay === null) return;
    if (immediate) invoke();
    const timer = setInterval(invoke, Math.max(1, delay));
    return () => clearInterval(timer);
  }, [delay, immediate, invoke]);
}
