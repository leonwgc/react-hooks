import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "../state/index.js";
export interface StepsOptions {
  count: number;
  initialStep?: number;
  validate?: (context: {
    from: number;
    to: number;
    signal: AbortSignal;
  }) => boolean | Promise<boolean>;
}
export function useSteps(options: StepsOptions) {
  const count = Number.isFinite(options.count)
    ? Math.max(1, Math.floor(options.count))
    : 1;
  const clamp = (step: number) =>
    Math.min(
      count - 1,
      Math.max(0, Number.isFinite(step) ? Math.floor(step) : 0),
    );
  const [step, setStep] = useState(() => clamp(options.initialStep ?? 0));
  const [completed, setCompleted] = useState<number[]>([]);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<unknown>();
  const controller = useRef<AbortController | null>(null);
  const version = useRef(0);
  const current = useRef(step);
  current.current = clamp(step);
  const cancel = useMemoizedFn(() => {
    version.current++;
    controller.current?.abort();
    controller.current = null;
    setValidating(false);
  });
  const goTo = useMemoizedFn(async (target: number): Promise<boolean> => {
    cancel();
    setError(undefined);
    const from = current.current;
    const to = clamp(target);
    if (to === from) return false;
    const id = version.current;
    const abort = new AbortController();
    controller.current = abort;
    setValidating(to > from && !!options.validate);
    try {
      if (
        to > from &&
        options.validate &&
        !(await options.validate({ from, to, signal: abort.signal }))
      )
        return false;
      if (id !== version.current || abort.signal.aborted) return false;
      current.current = to;
      setStep(to);
      if (to > from)
        setCompleted((previous) =>
          [...new Set([...previous, from])].sort((a, b) => a - b),
        );
      return true;
    } catch (reason) {
      if (id === version.current) setError(reason);
      return false;
    } finally {
      if (id === version.current) {
        setValidating(false);
        controller.current = null;
      }
    }
  });
  const reset = useMemoizedFn((target: number = options.initialStep ?? 0) => {
    cancel();
    const next = clamp(target);
    current.current = next;
    setStep(next);
    setCompleted([]);
    setError(undefined);
  });
  useEffect(() => {
    cancel();
    setStep((previous) => Math.min(previous, count - 1));
    setCompleted((previous) => previous.filter((value) => value < count));
  }, [count, cancel]);
  useEffect(
    () => () => {
      version.current++;
      controller.current?.abort();
    },
    [],
  );
  return {
    step: clamp(step),
    count,
    completed: completed.filter((value) => value < count),
    isFirst: clamp(step) === 0,
    isLast: clamp(step) === count - 1,
    validating,
    error,
    goTo,
    next: useMemoizedFn(() => goTo(current.current + 1)),
    previous: useMemoizedFn(() => goTo(current.current - 1)),
    reset,
    cancel,
  };
}
