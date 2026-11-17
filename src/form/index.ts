import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";
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
  mode?: "onSubmit" | "onBlur" | "onChange";
  revalidateMode?: "onBlur" | "onChange";
  validateDebounce?: number;
  dependencies?: Partial<
    Record<FieldPath<NoInfer<T>>, readonly FieldPath<NoInfer<T>>[]>
  >;
  schema?: (values: T) => FormErrors<T> | Promise<FormErrors<T>>;
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
  const validationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const pendingPaths = useRef<Set<FieldPath<T>> | null>(new Set());
  useEffect(() => {
    mounted.current = true;
    return () => {
      clearTimeout(validationTimer.current);
      mounted.current = false;
      validation.current++;
      lifecycle.current++;
    };
  }, []);
  const validate = useMemoizedFn(
    async (paths?: readonly FieldPath<T>[]): Promise<boolean> => {
      clearTimeout(validationTimer.current);
      const selected = paths && !config.current.schema ? new Set(paths) : null;
      if (selected) {
        let added = true;
        while (added) {
          added = false;
          for (const [field, dependencies] of Object.entries(
            config.current.dependencies ?? {},
          ) as [FieldPath<T>, readonly FieldPath<T>[]][]) {
            if (
              !selected.has(field) &&
              dependencies.some((dependency) =>
                [...selected].some(
                  (path) =>
                    path === dependency ||
                    path.startsWith(`${dependency}.`) ||
                    dependency.startsWith(`${path}.`),
                ),
              )
            ) {
              selected.add(field);
              added = true;
            }
          }
        }
      }
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
      const isSelected = (path: string) =>
        !selected ||
        [...selected].some(
          (parent) => path === parent || path.startsWith(`${parent}.`),
        );
      const results = await Promise.all(
        checks
          .filter(([path]) => isSelected(path))
          .map(async ([path, validator]) => {
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
      let schemaErrors: FormErrors<T> = {};
      let schemaFailure: unknown;
      try {
        schemaErrors = (await config.current.schema?.(snapshot)) ?? {};
      } catch (error) {
        schemaFailure = error ?? new Error("Schema validation failed");
      }
      if (
        !mounted.current ||
        id !== validation.current ||
        version !== revision.current
      )
        return false;
      if (schemaFailure !== undefined) {
        setValidating(false);
        setSubmitError(schemaFailure);
        return false;
      }
      const next: FormErrors<T> = { ...schemaErrors };
      results.forEach(([path, message]) => {
        if (message) next[path] = message;
      });
      updateErrors((previous) => {
        if (!selected) return next;
        const merged = { ...previous };
        for (const path of Object.keys(merged) as FieldPath<T>[])
          if (isSelected(path)) delete merged[path];
        return { ...merged, ...next };
      });
      if (!selected) pendingPaths.current = new Set();
      else if (pendingPaths.current)
        for (const path of pendingPaths.current)
          if (isSelected(path)) pendingPaths.current.delete(path);
      setValidating(false);
      return Object.keys(next).length === 0;
    },
  );
  const scheduleValidation = useMemoizedFn((path?: FieldPath<T>) => {
    clearTimeout(validationTimer.current);
    if (path) pendingPaths.current?.add(path);
    else pendingPaths.current = null;
    const run = () => {
      void validate(
        pendingPaths.current && config.current.dependencies
          ? [...pendingPaths.current]
          : undefined,
      );
    };
    if ((config.current.validateDebounce ?? 0) > 0)
      validationTimer.current = setTimeout(
        run,
        config.current.validateDebounce,
      );
    else run();
  });
  const validateOn = (event: "onBlur" | "onChange") =>
    (submitted.current
      ? (config.current.revalidateMode ?? "onChange")
      : (config.current.mode ?? "onSubmit")) === event;
  const changed = useMemoizedFn((next: T, path?: FieldPath<T>) => {
    clearTimeout(validationTimer.current);
    current.current = next;
    revision.current++;
    validation.current++;
    updateValues(next);
    setValidating(false);
    setSubmitError(undefined);
    if (validateOn("onChange")) scheduleValidation(path);
  });
  const setFieldValue = useMemoizedFn(
    <P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) =>
      changed(setPath(current.current, path, value), path),
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
    clearTimeout(validationTimer.current);
    pendingPaths.current = new Set();
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
        changed(setPath(current.current, path, next), path);
      },
      onBlur: () => {
        setFieldTouched(path);
        if (validateOn("onBlur")) scheduleValidation(path);
      },
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
  const fieldState = useLatest({ values, errors, touched });
  const listeners = useRef(new Set<() => void>());
  const control = useRef<FormControl<T> | null>(null);
  if (!control.current)
    control.current = {
      subscribe: (listener) => {
        listeners.current.add(listener);
        return () => {
          listeners.current.delete(listener);
        };
      },
      read: (path) => ({
        value: getPath(fieldState.current.values, path),
        error: fieldState.current.errors[path],
        touched: !!fieldState.current.touched[path],
      }),
      setValue: setFieldValue,
      blur: (path) => {
        setFieldTouched(path);
        if (validateOn("onBlur")) scheduleValidation(path);
      },
    };
  useEffect(() => {
    for (const listener of listeners.current) listener();
  }, [values, errors, touched]);
  return {
    control: control.current,
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

export interface FormControl<T extends object> {
  subscribe: (listener: () => void) => () => void;
  read: (path: FieldPath<T>) => {
    value: unknown;
    error: string | undefined;
    touched: boolean;
  };
  setValue: <P extends FieldPath<T>>(path: P, value: FieldValue<T, P>) => void;
  blur: (path: FieldPath<T>) => void;
}
export function useFormField<T extends object, P extends FieldPath<T>>(
  control: FormControl<T>,
  path: P,
) {
  const cache = useRef<ReturnType<FormControl<T>["read"]> | undefined>(
    undefined,
  );
  const getSnapshot = useCallback(() => {
    const next = control.read(path);
    if (
      !cache.current ||
      !Object.is(cache.current.value, next.value) ||
      cache.current.error !== next.error ||
      cache.current.touched !== next.touched
    )
      cache.current = next;
    return cache.current;
  }, [control, path]);
  const field = useSyncExternalStore(
    control.subscribe,
    getSnapshot,
    getSnapshot,
  );
  return {
    ...field,
    value: field.value as FieldValue<T, P>,
    setValue: useMemoizedFn((value: FieldValue<T, P>) =>
      control.setValue(path, value),
    ),
    onBlur: useMemoizedFn(() => control.blur(path)),
  };
}
