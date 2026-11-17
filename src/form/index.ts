import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { equal } from "../internal/utils.js";
import { getPath, setPath, type FieldPath, type FieldValue } from "./path.js";
export type { FieldPath, FieldValue } from "./path.js";
export type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
type ValidationResult = string | undefined | Promise<string | undefined>;
export type FormValidators<T> = {
  [K in keyof T]?: (value: T[K], values: T) => ValidationResult;
} & Partial<{
  [P in Exclude<FieldPath<T>, keyof T>]: (
    value: FieldValue<T, P>,
    values: T,
  ) => ValidationResult;
}>;
export interface FormOptions<T extends object> {
  initialValues: T;
  validators?: FormValidators<NoInfer<T>>;
}
export function useForm<T extends object>(options: FormOptions<T>) {
  const [values, updateValues] = useState(options.initialValues);
  const current = useLatest(values);
  const baseline = useRef(options.initialValues);
  const [errors, updateErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<
    Partial<Record<FieldPath<T>, boolean>>
  >({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [isValidating, setValidating] = useState(false);
  const [submitError, setSubmitError] = useState<unknown>();
  const [resetCount, setResetCount] = useState(0);
  const submitted = useRef(false);
  const validation = useRef(0);
  const revision = useRef(0);
  const lifecycle = useRef(0);
  const mounted = useRef(true);
  const lock = useRef<Promise<boolean> | null>(null);
  const config = useLatest(options);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      validation.current++;
      lifecycle.current++;
    };
  }, []);
  const validate = useMemoizedFn(async (): Promise<boolean> => {
    const id = ++validation.current,
      version = revision.current,
      snapshot = current.current;
    setValidating(true);
    const checks = Object.entries(config.current.validators ?? {}) as [
      FieldPath<T>,
      (
        value: unknown,
        values: T,
      ) => string | undefined | Promise<string | undefined>,
    ][];
    const results = await Promise.all(
      checks.map(async ([path, validator]) => {
        try {
          return [
            path,
            await validator(getPath(snapshot, path), snapshot),
          ] as const;
        } catch (error) {
          return [
            path,
            error instanceof Error ? error.message : "校验失败",
          ] as const;
        }
      }),
    );
    if (
      !mounted.current ||
      id !== validation.current ||
      version !== revision.current
    )
      return false;
    const next: FormErrors<T> = {};
    results.forEach(([path, message]) => {
      if (message) next[path] = message;
    });
    updateErrors(next);
    setValidating(false);
    return Object.keys(next).length === 0;
  });
  const changed = useMemoizedFn((next: T) => {
    current.current = next;
    revision.current++;
    validation.current++;
    updateValues(next);
    setValidating(false);
    setSubmitError(undefined);
    if (submitted.current) void validate();
  });
  const setFieldValue = useMemoizedFn(
    <P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) =>
      changed(setPath(current.current, path, value)),
  );
  const setValues = useMemoizedFn((next: T | ((previous: T) => T)) =>
    changed(typeof next === "function" ? next(current.current) : next),
  );
  const setFieldTouched = useMemoizedFn((path: FieldPath<T>, value = true) =>
    setTouched((previous) => ({ ...previous, [path]: value })),
  );
  const setFieldError = useMemoizedFn(
    (path: FieldPath<T>, message: string | undefined) =>
      updateErrors((previous) => {
        const next = { ...previous };
        if (message) next[path] = message;
        else delete next[path];
        return next;
      }),
  );
  const reset = useMemoizedFn((next: T = baseline.current) => {
    baseline.current = next;
    current.current = next;
    revision.current++;
    validation.current++;
    lifecycle.current++;
    submitted.current = false;
    updateValues(next);
    updateErrors({});
    setTouched({});
    setSubmitError(undefined);
    setValidating(false);
    setSubmitting(false);
    lock.current = null;
    setResetCount((n) => n + 1);
  });
  const register = <P extends FieldPath<T>>(path: P) => {
    const value = getPath(values, path);
    return {
      name: path,
      value:
        typeof value === "string" ||
        (typeof value === "number" && Number.isFinite(value))
          ? value
          : "",
      checked: typeof value === "boolean" ? value : undefined,
      "aria-invalid": Boolean(errors[path]),
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const input = event.target;
        const next =
          input instanceof HTMLInputElement && input.type === "checkbox"
            ? input.checked
            : typeof value === "number"
              ? input.value === ""
                ? Number.NaN
                : Number(input.value)
              : input.value;
        changed(setPath(current.current, path, next));
      },
      onBlur: () => setFieldTouched(path),
    };
  };
  const handleSubmit =
    (callback: (values: T) => void | Promise<void>) =>
    (event?: { preventDefault(): void }): Promise<boolean> => {
      event?.preventDefault();
      if (lock.current) return lock.current;
      submitted.current = true;
      setSubmitting(true);
      setSubmitError(undefined);
      const generation = lifecycle.current;
      const promise = (async () => {
        try {
          if (!(await validate()) || generation !== lifecycle.current)
            return false;
          await callback(current.current);
          return true;
        } catch (error) {
          if (mounted.current && generation === lifecycle.current)
            setSubmitError(error);
          return false;
        } finally {
          if (mounted.current && generation === lifecycle.current) {
            setSubmitting(false);
            lock.current = null;
          }
        }
      })();
      lock.current = promise;
      return promise;
    };
  return {
    values,
    errors,
    touched,
    isDirty: !equal(baseline.current, values),
    isSubmitting,
    isValidating,
    submitError,
    resetCount,
    setFieldValue,
    setValues,
    setFieldTouched,
    setFieldError,
    register,
    validate,
    handleSubmit,
    reset,
  };
}
export type FormApi<T extends object> = ReturnType<typeof useForm<T>>;
export function useFieldArray<T extends object, P extends FieldPath<T>>(
  form: FormApi<T>,
  name: P & (FieldValue<T, P> extends readonly unknown[] ? P : never),
) {
  type Item = FieldValue<T, P> extends readonly (infer I)[] ? I : never;
  const prefix = useId();
  const sequence = useRef(0);
  const ids = useRef<string[]>([]);
  const generation = useRef(form.resetCount);
  const raw = getPath(form.values, name);
  const items: Item[] = Array.isArray(raw) ? raw : [];
  if (generation.current !== form.resetCount) {
    ids.current = [];
    generation.current = form.resetCount;
  }
  while (ids.current.length < items.length)
    ids.current.push(`${prefix}-${sequence.current++}`);
  ids.current = ids.current.slice(0, items.length);
  const values = useLatest(items);
  const commit = useMemoizedFn((next: Item[]) => {
    values.current = next;
    // Array positions change; clear old indexed metadata rather than attaching it to another row.
    Object.keys(form.errors)
      .filter((key) => key.startsWith(`${name}.`))
      .forEach((key) => form.setFieldError(key as FieldPath<T>, undefined));
    Object.keys(form.touched)
      .filter((key) => key.startsWith(`${name}.`))
      .forEach((key) => form.setFieldTouched(key as FieldPath<T>, false));
    form.setValues((previous) => setPath(previous, name, next));
  });
  const append = useMemoizedFn((item: Item) => {
    ids.current.push(`${prefix}-${sequence.current++}`);
    commit([...values.current, item]);
  });
  const remove = useMemoizedFn((index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= values.current.length)
      return;
    ids.current.splice(index, 1);
    commit(values.current.filter((_, position) => position !== index));
  });
  const move = useMemoizedFn((from: number, to: number) => {
    if (
      ![from, to].every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < values.current.length,
      ) ||
      from === to
    )
      return;
    const next = [...values.current];
    next.splice(to, 0, next.splice(from, 1)[0]);
    ids.current.splice(to, 0, ids.current.splice(from, 1)[0]);
    commit(next);
  });
  const replace = useMemoizedFn((next: Item[]) => {
    ids.current = next.map(() => `${prefix}-${sequence.current++}`);
    commit(next);
  });
  return {
    fields: items.map((value, index) => ({ id: ids.current[index], value })),
    append,
    remove,
    move,
    replace,
  };
}
