import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { equal } from "../internal/utils.js";
import {
  getPath,
  setPath,
  unsetPath,
  type FieldPath,
  type FieldValue,
} from "./path.js";
export type { FieldPath, FieldValue } from "./path.js";
export type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
type FieldNode = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export interface RegisterOptions {
  /** Option value for radio buttons and checkbox groups sharing one field. */
  value?: string;
  /** File inputs are uncontrolled; their value becomes a `File[]`. */
  type?: "file";
}
interface ArrayAdapter {
  commit: (
    path: string,
    values: unknown[],
    indices: readonly (number | null)[],
  ) => void;
  version: (path: string) => number;
}
const useBrowserLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;
const arrayAdapters = new WeakMap<object, ArrayAdapter>();
const under = (path: string, parent: string) =>
  path === parent || path.startsWith(`${parent}.`);
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
  shouldUnregister?: boolean;
  shouldFocusError?: boolean;
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
  const [errors, setErrorsState] = useState<FormErrors<T>>({});
  const errorsRef = useRef(errors);
  const updateErrors = useMemoizedFn(
    (next: FormErrors<T> | ((previous: FormErrors<T>) => FormErrors<T>)) => {
      const result =
        typeof next === "function" ? next(errorsRef.current) : next;
      errorsRef.current = result;
      setErrorsState(result);
    },
  );
  const [touched, setTouchedState] = useState<
    Partial<Record<FieldPath<T>, boolean>>
  >({});
  const touchedRef = useRef(touched);
  const setTouched = useMemoizedFn(
    (next: typeof touched | ((previous: typeof touched) => typeof touched)) => {
      const result =
        typeof next === "function" ? next(touchedRef.current) : next;
      touchedRef.current = result;
      setTouchedState(result);
    },
  );
  const inactive = useRef(new Set<string>());
  const nodes = useRef(new Map<string, FieldNode>());
  const refs = useRef(new Map<string, (node: FieldNode | null) => void>());
  const fieldResets = useRef(new Map<string, number>());
  const excluded = (path: string) =>
    [...inactive.current].some((parent) => under(path, parent));
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
  const runValidation = useMemoizedFn(
    async (paths?: readonly FieldPath<T>[]): Promise<boolean | "stale"> => {
      clearTimeout(validationTimer.current);
      const selected = paths ? new Set<string>(paths) : null;
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
          .filter(([path]) => isSelected(path) && !excluded(path))
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
      if (!mounted.current) return false;
      if (id !== validation.current || version !== revision.current)
        return "stale";
      if (schemaFailure !== undefined) {
        setValidating(false);
        setSubmitError(schemaFailure);
        return false;
      }
      const next: FormErrors<T> = { ...schemaErrors };
      for (const path of Object.keys(next) as FieldPath<T>[])
        if (excluded(path) || !isSelected(path)) delete next[path];
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
  const validate = useMemoizedFn(
    async (paths?: readonly FieldPath<T>[]): Promise<boolean> =>
      (await runValidation(paths)) === true,
  );
  const scheduleValidation = useMemoizedFn((path?: FieldPath<T>) => {
    clearTimeout(validationTimer.current);
    if (path) pendingPaths.current?.add(path);
    else pendingPaths.current = null;
    const run = () => {
      // Only the changed/blurred fields (plus declared dependents) are validated.
      void validate(pendingPaths.current ? [...pendingPaths.current] : undefined);
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
    inactive.current.clear();
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
  const clearFieldMeta = useMemoizedFn(
    (path: string, keepError = false, keepTouched = false) => {
      if (!keepError)
        updateErrors((previous) => {
          const next = { ...previous };
          for (const key of Object.keys(next) as FieldPath<T>[])
            if (under(key, path)) delete next[key];
          return next;
        });
      if (!keepTouched)
        setTouched((previous) => {
          const next = { ...previous };
          for (const key of Object.keys(next) as FieldPath<T>[])
            if (under(key, path)) delete next[key];
          return next;
        });
    },
  );
  const resetField = useMemoizedFn(
    <P extends FieldPath<T>>(
      path: P,
      settings: {
        defaultValue?: FieldValue<T, P>;
        keepError?: boolean;
        keepTouched?: boolean;
      } = {},
    ) => {
      if (Object.prototype.hasOwnProperty.call(settings, "defaultValue"))
        baseline.current = setPath(
          baseline.current,
          path,
          settings.defaultValue,
        );
      clearTimeout(validationTimer.current);
      validation.current++;
      revision.current++;
      pendingPaths.current = new Set();
      setValidating(false);
      setSubmitError(undefined);
      const next = setPath(
        current.current,
        path,
        getPath(baseline.current, path),
      );
      current.current = next;
      updateValues(next);
      fieldResets.current.set(path, (fieldResets.current.get(path) ?? 0) + 1);
      clearFieldMeta(path, settings.keepError, settings.keepTouched);
    },
  );
  const unregister = useMemoizedFn(
    (path: FieldPath<T>, settings: { keepValue?: boolean } = {}) => {
      inactive.current.add(path);
      clearTimeout(validationTimer.current);
      validation.current++;
      revision.current++;
      pendingPaths.current = new Set();
      setValidating(false);
      clearFieldMeta(path);
      if (!settings.keepValue) {
        const next = unsetPath(current.current, path);
        current.current = next;
        updateValues(next);
      }
    },
  );
  const getFieldRef = useMemoizedFn((path: FieldPath<T>) => {
    let ref = refs.current.get(path);
    if (!ref) {
      ref = (node) => {
        if (node) {
          nodes.current.set(path, node);
          for (const parent of inactive.current)
            if (under(path, parent)) inactive.current.delete(parent);
        } else {
          nodes.current.delete(path);
          queueMicrotask(() => {
            if (
              mounted.current &&
              !nodes.current.has(path) &&
              config.current.shouldUnregister
            )
              unregister(path);
          });
        }
      };
      refs.current.set(path, ref);
    }
    return ref;
  });
  const focusField = useMemoizedFn((path: FieldPath<T>) => {
    const node = nodes.current.get(path);
    if (
      !node ||
      !node.isConnected ||
      node.disabled ||
      node.getClientRects().length === 0
    )
      return false;
    node.focus();
    return document.activeElement === node;
  });
  const focusFirstError = useMemoizedFn(() => {
    const candidates = [...nodes.current]
      .filter(([path]) => errorsRef.current[path as FieldPath<T>])
      .sort((a, b) => (a[1].compareDocumentPosition(b[1]) & 2 ? 1 : -1));
    return candidates.some(([path]) => focusField(path as FieldPath<T>));
  });
  const register = <P extends FieldPath<T>>(
    path: P,
    settings: RegisterOptions = {},
  ) => {
    const value = getPath(values, path);
    const choice = settings.value;
    const isFile = settings.type === "file";
    const isList = Array.isArray(value);
    let checked: boolean | undefined;
    let controlled: string | number | readonly string[] | undefined;
    if (choice !== undefined) {
      // Radio buttons and checkbox groups share one field and carry their own value.
      controlled = choice;
      checked = isList
        ? (value as unknown[]).includes(choice)
        : Object.is(value, choice);
    } else if (!isFile) {
      if (typeof value === "boolean") {
        controlled = "";
        checked = value;
      } else if (isList)
        controlled = (value as unknown[]).map((item) => String(item));
      else
        controlled =
          typeof value === "string" ||
          (typeof value === "number" && Number.isFinite(value))
            ? value
            : "";
    }
    return {
      name: path,
      ref: getFieldRef(path),
      value: controlled,
      checked,
      "aria-invalid": Boolean(errors[path]),
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const input = event.target;
        const latest = getPath(current.current, path);
        let next: unknown;
        if (isFile && input instanceof HTMLInputElement)
          next = Array.from(input.files ?? []);
        else if (choice !== undefined) {
          const on = input instanceof HTMLInputElement ? input.checked : true;
          if (Array.isArray(latest))
            next = on
              ? latest.includes(choice)
                ? latest
                : [...latest, choice]
              : latest.filter((item) => item !== choice);
          else if (on) next = choice;
          else if (input instanceof HTMLInputElement && input.type === "radio")
            return;
          else next = typeof latest === "boolean" ? false : undefined;
        } else if (input instanceof HTMLSelectElement && input.multiple)
          next = Array.from(input.selectedOptions, (option) => option.value);
        else if (input instanceof HTMLInputElement && input.type === "checkbox")
          next = input.checked;
        else if (typeof value === "number")
          next = input.value === "" ? Number.NaN : Number(input.value);
        else next = input.value;
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
          let valid = await runValidation();
          while (valid === "stale" && generation === lifecycle.current)
            valid = await runValidation();
          if (generation !== lifecycle.current) return false;
          if (!valid) {
            if (config.current.shouldFocusError) focusFirstError();
            return false;
          }
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
  const commitArray = useMemoizedFn(
    (path: string, next: unknown[], indices: readonly (number | null)[]) => {
      const indexMap = new Map(
        indices.flatMap((old, index) =>
          old === null ? [] : [[old, index] as const],
        ),
      );
      const remapKey = (key: string) => {
        if (!key.startsWith(`${path}.`)) return key;
        const [head, ...rest] = key.slice(path.length + 1).split(".");
        const mapped = indexMap.get(Number(head));
        return mapped === undefined
          ? null
          : `${path}.${mapped}${rest.length ? "." + rest.join(".") : ""}`;
      };
      const remap = <V>(metadata: Partial<Record<FieldPath<T>, V>>) => {
        const result: Partial<Record<FieldPath<T>, V>> = {};
        for (const key of Object.keys(metadata) as FieldPath<T>[]) {
          // Only an existing array index changes; the validated field suffix is retained.
          const mapped = remapKey(key) as FieldPath<T> | null;
          if (mapped !== null) result[mapped] = metadata[key];
        }
        return result;
      };
      const previousErrors = errorsRef.current,
        previousTouched = touchedRef.current;
      inactive.current = new Set(
        [...inactive.current].flatMap((key) => {
          const mapped = remapKey(key);
          return mapped === null ? [] : [mapped];
        }),
      );
      changed(setPath(current.current, path, next), path as FieldPath<T>);
      updateErrors(remap<string>(previousErrors));
      setTouched(remap<boolean>(previousTouched));
    },
  );
  arrayAdapters.set(control.current, {
    commit: commitArray,
    version: (path) =>
      [...fieldResets.current].reduce(
        (sum, [parent, version]) => sum + (under(path, parent) ? version : 0),
        0,
      ),
  });
  // Notify isolated field subscribers in the same commit to avoid a stale frame.
  useBrowserLayoutEffect(() => {
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
    resetField,
    unregister,
    getFieldRef,
    focusField,
    focusFirstError,
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
  const adapter = arrayAdapters.get(form.control)!;
  const resetVersion = `${form.resetCount}:${adapter.version(name)}`;
  const generation = useRef(resetVersion);
  const raw = getPath(form.values, name);
  const items: Item[] = Array.isArray(raw) ? raw : [];
  if (generation.current !== resetVersion) {
    ids.current = [];
    generation.current = resetVersion;
  }
  while (ids.current.length < items.length)
    ids.current.push(`${prefix}-${sequence.current++}`);
  ids.current = ids.current.slice(0, items.length);
  const values = useLatest(items);
  const commit = (next: Item[], mapping: readonly (number | null)[]) => {
    values.current = next;
    adapter.commit(name, next, mapping);
  };
  const insert = useMemoizedFn((index: number, item: Item) => {
    if (!Number.isInteger(index) || index < 0 || index > values.current.length)
      return;
    const next = [...values.current],
      mapping: (number | null)[] = next.map((_, i) => i);
    next.splice(index, 0, item);
    mapping.splice(index, 0, null);
    ids.current.splice(index, 0, `${prefix}-${sequence.current++}`);
    commit(next, mapping);
  });
  const append = useMemoizedFn((item: Item) =>
    insert(values.current.length, item),
  );
  const prepend = useMemoizedFn((item: Item) => insert(0, item));
  const valid = (index: number) =>
    Number.isInteger(index) && index >= 0 && index < values.current.length;
  const remove = useMemoizedFn((index: number) => {
    if (!valid(index)) return;
    const mapping = values.current.map((_, i) => i).filter((i) => i !== index);
    ids.current.splice(index, 1);
    commit(
      mapping.map((i) => values.current[i]),
      mapping,
    );
  });
  const move = useMemoizedFn((from: number, to: number) => {
    if (!valid(from) || !valid(to) || from === to) return;
    const mapping = values.current.map((_, i) => i);
    mapping.splice(to, 0, mapping.splice(from, 1)[0]);
    ids.current.splice(to, 0, ids.current.splice(from, 1)[0]);
    commit(
      mapping.map((i) => values.current[i]),
      mapping,
    );
  });
  const swap = useMemoizedFn((a: number, b: number) => {
    if (!valid(a) || !valid(b) || a === b) return;
    const mapping = values.current.map((_, i) => i);
    [mapping[a], mapping[b]] = [mapping[b], mapping[a]];
    [ids.current[a], ids.current[b]] = [ids.current[b], ids.current[a]];
    commit(
      mapping.map((i) => values.current[i]),
      mapping,
    );
  });
  const update = useMemoizedFn((index: number, item: Item) => {
    if (!valid(index)) return;
    const next = [...values.current];
    next[index] = item;
    commit(
      next,
      next.map((_, i) => i),
    );
  });
  const replace = useMemoizedFn((next: Item[]) => {
    ids.current = next.map(() => `${prefix}-${sequence.current++}`);
    commit(
      next,
      next.map(() => null),
    );
  });
  return {
    fields: items.map((value, index) => ({ id: ids.current[index], value })),
    append,
    prepend,
    insert,
    remove,
    move,
    swap,
    update,
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
