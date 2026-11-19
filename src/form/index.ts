import {
  useEffect,
  useId,
  useLayoutEffect,
  useReducer,
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
import {
  createFormStore,
  messagesOf,
  recomputeDirty,
  under,
  type FormState,
  type FormStore,
} from "./store.js";
import {
  STALE,
  SettleFailure,
  combineChecks,
  expandPattern,
  normalizeOutcome,
  ruleKeys,
  rulesCheck,
  settle,
  type Check,
  type FieldError,
  type FieldRules,
  type Validator,
} from "./rules.js";
import type { FormSchema, SchemaErrors } from "./adapters.js";
export type { FieldPath, FieldValue } from "./path.js";
export type {
  FieldError,
  FieldRules,
  RuleValue,
  ValidationOutcome,
  ValidationResult,
  Validator,
  ValidatorContext,
} from "./rules.js";
export {
  standardSchema,
  yupSchema,
  type FormSchema,
  type SchemaContext,
  type SchemaErrors,
  type StandardSchemaLike,
  type YupSchemaLike,
} from "./adapters.js";

export type FormErrors<T> = Partial<Record<FieldPath<T>, string>>;
export type FormErrorDetails<T> = Partial<Record<FieldPath<T>, FieldError>>;
type FieldNode = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface RegisterOptions<V = unknown, T = unknown> extends FieldRules<
  V,
  T
> {
  /** Option value for radio buttons and checkbox groups sharing one field. */
  value?: string;
  /** File inputs are uncontrolled; their value becomes a `File[]`. */
  type?: "file";
  /** Store numbers; an empty input becomes `undefined` instead of `NaN`. */
  valueAsNumber?: boolean;
  /** Converts the raw input string before it is stored. */
  setValueAs?: (raw: string) => unknown;
}
export interface SetValueOptions {
  /** true: validate now; false: never; omitted: follow mode/revalidateMode. */
  shouldValidate?: boolean;
  shouldTouch?: boolean;
  /** false treats the new value as the baseline, so the field stays clean. */
  shouldDirty?: boolean;
}
export interface ResetOptions {
  /** Keep values the user already edited (e.g. when server data refreshes). */
  keepDirtyValues?: boolean;
  keepErrors?: boolean;
  keepTouched?: boolean;
  keepSubmitCount?: boolean;
}
export interface PersistOptions {
  key: string;
  storage?:
    "local" | "session" | Pick<Storage, "getItem" | "setItem" | "removeItem">;
  /** Save delay in ms after the last change. Default 300. */
  debounce?: number;
  /** Paths that are never saved (files, secrets…). */
  exclude?: readonly string[];
  /** Remove the draft after a successful submit. Default true. */
  clearOnSubmit?: boolean;
}
export type FormValidators<T> = {
  [K in keyof T]?: Validator<T[K], T>;
} & Partial<{
  [P in Exclude<FieldPath<T>, keyof T>]: Validator<FieldValue<T, P>, T>;
}> & {
    /** Wildcard paths such as `rows.*.name` apply to every matching item. */
    [pattern: `${string}*${string}`]: Validator<unknown, T> | undefined;
  };
export interface FormOptions<T extends object> {
  initialValues: T;
  /** Externally controlled values; when they change the form resets to them. */
  values?: T;
  resetOptions?: Pick<ResetOptions, "keepDirtyValues">;
  /** Loads the initial values asynchronously (edit pages); see isLoading/loadError. */
  loadValues?: (context: { signal: AbortSignal }) => Promise<T>;
  shouldUnregister?: boolean;
  shouldFocusError?: boolean;
  validators?: FormValidators<NoInfer<T>>;
  mode?: "onSubmit" | "onBlur" | "onChange";
  revalidateMode?: "onBlur" | "onChange";
  validateDebounce?: number;
  dependencies?: Partial<
    Record<FieldPath<NoInfer<T>>, readonly FieldPath<NoInfer<T>>[]>
  >;
  /** "all" collects every failed rule of a field into `errorDetails[path].types`. */
  criteriaMode?: "firstError" | "all";
  schema?: FormSchema<T>;
  persist?: PersistOptions;
}
export interface SubmitOptions<T, R> {
  onInvalid?: (
    errors: FormErrors<T>,
    details: FormErrorDetails<T>,
  ) => void | Promise<void>;
  /** Converts values before they reach the submit callback (trim, drop empties…). */
  transform?: (values: T) => R | Promise<R>;
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

interface FormInternals {
  store: FormStore<object>;
  commitArray: (
    path: string,
    values: unknown[],
    indices: readonly (number | null)[],
  ) => void;
  setArrayRules: (path: string, rules: FieldRules | undefined) => void;
}
const internals = new WeakMap<object, FormInternals>();
const internalsOf = (control: object) => {
  const found = internals.get(control);
  if (!found) throw new Error("Unknown form control.");
  return found;
};
const useBrowserLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;
const resolveStorage = (storage: PersistOptions["storage"]) => {
  if (typeof window === "undefined") return null;
  try {
    if (!storage || storage === "local") return window.localStorage;
    if (storage === "session") return window.sessionStorage;
    return storage;
  } catch {
    return null;
  }
};
const encodeId = (value: string) =>
  value.replace(
    /[^A-Za-z0-9_-]/g,
    (char) => `_${char.charCodeAt(0).toString(16)}`,
  );
const pickRules = (settings: FieldRules): FieldRules | undefined => {
  const rules: Record<string, unknown> = {};
  for (const key of ruleKeys)
    if (settings[key] !== undefined) rules[key] = settings[key];
  return Object.keys(rules).length ? (rules as FieldRules) : undefined;
};
const sameRecord = <V>(
  a: Readonly<Record<string, V>>,
  b: Readonly<Record<string, V>>,
) => {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => Object.is(a[key], b[key]))
  );
};
const toDetail = (
  error: string | FieldError | undefined,
  type: string,
): FieldError | undefined =>
  typeof error === "string"
    ? normalizeOutcome(error, type)
    : error
      ? { ...error, type: error.type || type }
      : undefined;

export function useForm<T extends object>(options: FormOptions<T>) {
  const formId = useId();
  const config = useLatest(options);
  const storeRef = useRef<FormStore<T> | null>(null);
  if (!storeRef.current)
    storeRef.current = createFormStore<T>({
      values: options.values ?? options.initialValues,
      errorDetails: {},
      touched: {},
      dirty: {},
      validating: {},
      schemaValidating: false,
      isSubmitting: false,
      submitError: undefined,
      submitCount: 0,
      isSubmitSuccessful: false,
      resetCount: 0,
      fieldResets: {},
      isLoading: !!options.loadValues,
      loadError: undefined,
    });
  const store = storeRef.current;
  const { get, set } = store;
  const baseline = useRef<T>(options.values ?? options.initialValues);
  const inactive = useRef(new Set<string>());
  const nodes = useRef(new Map<string, FieldNode>());
  const refs = useRef(new Map<string, (node: FieldNode | null) => void>());
  const fieldRules = useRef(new Map<string, FieldRules>());
  const arrayRules = useRef(new Map<string, FieldRules>());
  const runs = useRef(new Map<string, AbortController>());
  const schemaRun = useRef<AbortController | null>(null);
  const submitted = useRef(false);
  const lifecycle = useRef(0);
  const mounted = useRef(true);
  const lock = useRef<Promise<boolean> | null>(null);
  const validationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const persistTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const pendingPaths = useRef<Set<string> | null>(new Set());
  const excluded = (path: string) =>
    [...inactive.current].some((parent) => under(path, parent));
  const fieldId = (path: string, choice?: string) =>
    `${formId}-${encodeId(path)}${choice === undefined ? "" : `-${encodeId(choice)}`}`;
  const errorIdOf = (path: string) => `${formId}-${encodeId(path)}-error`;

  // ---- Render subscription: re-render only for state this render actually read.
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  const tracked = useRef(new Map<string, (state: FormState<T>) => unknown>());
  tracked.current = new Map();
  const seen = useRef(get());
  seen.current = get();
  const watch = (key: string, select: (state: FormState<T>) => unknown) => {
    if (!tracked.current.has(key)) tracked.current.set(key, select);
  };
  useBrowserLayoutEffect(() => {
    const check = () => {
      const next = get(),
        previous = seen.current;
      if (next === previous) return;
      seen.current = next;
      for (const select of tracked.current.values())
        if (!Object.is(select(previous), select(next))) {
          rerender();
          return;
        }
    };
    check();
    return store.subscribe(check);
  }, [store]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      clearTimeout(validationTimer.current);
      mounted.current = false;
      lifecycle.current++;
      for (const controller of runs.current.values()) controller.abort();
      runs.current.clear();
      schemaRun.current?.abort();
      schemaRun.current = null;
    };
  }, []);

  // ---- Validation engine: every field runs (and is cancelled) independently.
  const stopRuns = (match: (path: string) => boolean) => {
    schemaRun.current?.abort();
    schemaRun.current = null;
    let validating: Record<string, true> | null = null;
    for (const [path, controller] of runs.current) {
      if (!match(path)) continue;
      controller.abort();
      runs.current.delete(path);
      if (get().validating[path]) {
        validating ??= { ...get().validating };
        delete validating[path];
      }
    }
    const patch: Partial<FormState<T>> = { schemaValidating: false };
    if (validating) patch.validating = validating;
    set(patch);
  };
  const dependencyMap = () =>
    (config.current.dependencies ?? {}) as Record<string, readonly string[]>;
  const affects = (validatorPath: string, changedPath: string) =>
    under(validatorPath, changedPath) ||
    under(changedPath, validatorPath) ||
    dependencyMap()[validatorPath]?.some(
      (dependency) =>
        under(changedPath, dependency) || under(dependency, changedPath),
    ) === true;
  const closure = (paths: readonly string[]) => {
    const selected = new Set<string>(paths);
    let added = true;
    while (added) {
      added = false;
      for (const [field, dependencies] of Object.entries(dependencyMap()))
        if (
          !selected.has(field) &&
          dependencies.some((dependency) =>
            [...selected].some(
              (path) => under(path, dependency) || under(dependency, path),
            ),
          )
        ) {
          selected.add(field);
          added = true;
        }
    }
    return selected;
  };
  const collectChecks = (snapshot: T) => {
    const all = config.current.criteriaMode === "all";
    const groups = new Map<string, Check[]>();
    const add = (path: string, check: Check) => {
      const list = groups.get(path);
      if (list) list.push(check);
      else groups.set(path, [check]);
    };
    for (const source of [arrayRules.current, fieldRules.current])
      for (const [path, rules] of source) add(path, rulesCheck(rules, all));
    for (const [key, validator] of Object.entries(
      config.current.validators ?? {},
    ) as [string, Validator<unknown, T> | undefined][]) {
      if (!validator) continue;
      const check: Check = async (value, values, context) =>
        normalizeOutcome(
          await validator(value, values as T, context),
          "validate",
        );
      for (const path of key.includes("*")
        ? expandPattern(key, snapshot)
        : [key])
        add(path, check);
    }
    return [...groups].map(
      ([path, checks]) => [path, combineChecks(checks, all)] as const,
    );
  };
  const runValidation = useMemoizedFn(
    async (paths?: readonly string[]): Promise<boolean | "stale"> => {
      clearTimeout(validationTimer.current);
      const cfg = config.current;
      const selected = paths ? closure(paths) : null;
      const isSelected = (path: string) =>
        !selected || [...selected].some((parent) => under(path, parent));
      const snapshot = get().values;
      const started = collectChecks(snapshot)
        .filter(([path]) => isSelected(path) && !excluded(path))
        .map(([path, check]) => {
          runs.current.get(path)?.abort();
          const controller = new AbortController();
          runs.current.set(path, controller);
          return {
            path,
            controller,
            outcome: settle(
              () =>
                check(getPath(snapshot, path), snapshot, {
                  signal: controller.signal,
                  path,
                }),
              controller.signal,
            ),
          };
        });
      const schema = cfg.schema;
      let schemaController: AbortController | null = null;
      if (schema) {
        schemaRun.current?.abort();
        schemaController = new AbortController();
        schemaRun.current = schemaController;
      }
      if (started.length || schemaController) {
        const validating = { ...get().validating };
        for (const run of started) validating[run.path] = true;
        set({
          validating,
          schemaValidating: schemaController ? true : get().schemaValidating,
        });
      }
      const schemaOutcome =
        schemaController && schema
          ? settle(
              async () =>
                schema(snapshot, {
                  paths: selected ? [...selected] : undefined,
                  signal: schemaController.signal,
                }),
              schemaController.signal,
            )
          : null;
      const outcomes = await Promise.all(started.map((run) => run.outcome));
      const schemaResult = schemaOutcome ? await schemaOutcome : undefined;
      if (!mounted.current) return false;
      const state = get();
      const validating = { ...state.validating };
      const applied = new Set<string>();
      const produced: Record<string, FieldError> = {};
      let stale = false;
      started.forEach((run, index) => {
        if (runs.current.get(run.path) !== run.controller) {
          stale = true;
          return;
        }
        runs.current.delete(run.path);
        delete validating[run.path];
        applied.add(run.path);
        const outcome = outcomes[index];
        if (outcome instanceof SettleFailure)
          produced[run.path] = {
            type: "validate",
            message:
              outcome.error instanceof Error && outcome.error.message
                ? outcome.error.message
                : "校验失败",
          };
        else if (outcome && outcome !== STALE) produced[run.path] = outcome;
      });
      let schemaCovered = !schemaController;
      let schemaFailure: unknown;
      if (schemaController) {
        if (schemaRun.current !== schemaController || schemaResult === STALE)
          stale = true;
        else {
          schemaRun.current = null;
          if (schemaResult instanceof SettleFailure)
            schemaFailure =
              schemaResult.error ?? new Error("Schema validation failed");
          else {
            schemaCovered = true;
            for (const [path, error] of Object.entries(
              (schemaResult ?? {}) as SchemaErrors,
            )) {
              const detail = toDetail(error, "schema");
              if (
                detail &&
                isSelected(path) &&
                !excluded(path) &&
                !produced[path]
              )
                produced[path] = detail;
            }
          }
        }
      }
      const patch: Partial<FormState<T>> = {
        validating: sameRecord(validating, state.validating)
          ? state.validating
          : validating,
        schemaValidating: schemaRun.current !== null,
      };
      if (schemaFailure !== undefined) {
        set({ ...patch, submitError: schemaFailure });
        return false;
      }
      const startedPaths = new Set(started.map((run) => run.path));
      // A path is resolved when this run produced a fresh verdict for it.
      const resolved = (path: string) =>
        applied.has(path) || (!startedPaths.has(path) && schemaCovered);
      const errors: Record<string, FieldError> = {};
      for (const [path, error] of Object.entries(state.errorDetails)) {
        if (excluded(path) || (isSelected(path) && resolved(path))) continue;
        errors[path] = error;
      }
      Object.assign(errors, produced);
      patch.errorDetails = sameRecord(errors, state.errorDetails)
        ? state.errorDetails
        : errors;
      set(patch);
      if (stale) return "stale";
      return Object.keys(produced).length === 0;
    },
  );
  const validate = useMemoizedFn(
    async (paths?: readonly FieldPath<T>[]): Promise<boolean> =>
      (await runValidation(paths)) === true,
  );
  const scheduleValidation = useMemoizedFn((path?: string) => {
    clearTimeout(validationTimer.current);
    if (path) pendingPaths.current?.add(path);
    else pendingPaths.current = null;
    const run = () => {
      // Only the changed/blurred fields (plus declared dependents) are validated.
      const pending = pendingPaths.current
        ? [...pendingPaths.current]
        : undefined;
      pendingPaths.current = new Set();
      void runValidation(pending);
    };
    const wait = config.current.validateDebounce ?? 0;
    if (wait > 0) validationTimer.current = setTimeout(run, wait);
    else run();
  });
  const validateOn = (event: "onBlur" | "onChange") =>
    (submitted.current
      ? (config.current.revalidateMode ?? "onChange")
      : (config.current.mode ?? "onSubmit")) === event;

  // ---- Value updates.
  const changed = useMemoizedFn(
    (next: T, path?: string, settings: SetValueOptions = {}) => {
      stopRuns(path ? (p) => affects(p, path) : () => true);
      if (settings.shouldDirty === false)
        baseline.current = path
          ? setPath(baseline.current, path, getPath(next, path))
          : next;
      const state = get();
      const patch: Partial<FormState<T>> = {
        values: next,
        dirty: recomputeDirty(state.dirty, baseline.current, next, path),
        submitError: undefined,
      };
      if (settings.shouldTouch && path && !state.touched[path])
        patch.touched = { ...state.touched, [path]: true };
      set(patch);
      if (settings.shouldValidate === true)
        void runValidation(path ? [path] : undefined);
      else if (settings.shouldValidate !== false && validateOn("onChange"))
        scheduleValidation(path);
    },
  );
  const setFieldValue = useMemoizedFn(
    <P extends FieldPath<T>>(
      path: P,
      value: FieldValue<T, P>,
      settings?: SetValueOptions,
    ) => changed(setPath(get().values, path, value), path, settings),
  );
  const setValues = useMemoizedFn(
    (next: T | ((previous: T) => T), settings?: SetValueOptions) =>
      changed(
        typeof next === "function" ? next(get().values) : next,
        undefined,
        settings,
      ),
  );
  const setFieldTouched = useMemoizedFn(
    (path: FieldPath<T>, value: boolean = true) => {
      const touched: Record<string, boolean> = { ...get().touched };
      if (touched[path] === value) return;
      touched[path] = value;
      set({ touched });
    },
  );
  const blurField = useMemoizedFn((path: FieldPath<T>) => {
    setFieldTouched(path);
    if (validateOn("onBlur")) scheduleValidation(path);
  });
  const setFieldError = useMemoizedFn(
    (path: FieldPath<T>, error: string | FieldError | undefined) => {
      const details = { ...get().errorDetails };
      const detail = toDetail(error, "manual");
      if (detail) details[path] = detail;
      else delete details[path];
      set({ errorDetails: details });
    },
  );
  /** Writes many errors at once, e.g. field errors returned by the server. */
  const setErrors = useMemoizedFn(
    (
      record: Partial<Record<FieldPath<T>, string | FieldError | undefined>>,
      settings: { replace?: boolean } = {},
    ) => {
      const details: Record<string, FieldError> = settings.replace
        ? {}
        : { ...get().errorDetails };
      for (const [path, error] of Object.entries(record) as [
        string,
        string | FieldError | undefined,
      ][]) {
        const detail = toDetail(error, "server");
        if (detail) details[path] = detail;
        else delete details[path];
      }
      set({ errorDetails: details });
    },
  );
  const clearMeta = (path: string, keepError = false, keepTouched = false) => {
    const state = get();
    const prune = <V>(record: Readonly<Record<string, V>>) => {
      const next = Object.fromEntries(
        Object.entries(record).filter(([key]) => !under(key, path)),
      );
      return sameRecord(next, record) ? record : next;
    };
    set({
      errorDetails: keepError ? state.errorDetails : prune(state.errorDetails),
      touched: keepTouched ? state.touched : prune(state.touched),
    });
  };
  const reset = useMemoizedFn(
    (next: T = baseline.current, settings: ResetOptions = {}) => {
      clearTimeout(validationTimer.current);
      pendingPaths.current = new Set();
      stopRuns(() => true);
      const state = get();
      const keepDirty = settings.keepDirtyValues === true;
      const dirtyPaths = Object.keys(state.dirty);
      let values = next;
      if (keepDirty)
        for (const path of dirtyPaths)
          values = setPath(values, path, getPath(state.values, path));
      const keep = (path: string) =>
        dirtyPaths.some((dirty) => under(path, dirty) || under(dirty, path));
      const filter = <V>(
        record: Readonly<Record<string, V>>,
        retain?: boolean,
      ) =>
        retain
          ? record
          : keepDirty
            ? Object.fromEntries(
                Object.entries(record).filter(([path]) => keep(path)),
              )
            : {};
      baseline.current = next;
      const patch: Partial<FormState<T>> = {
        values,
        dirty: keepDirty ? recomputeDirty({}, next, values) : {},
        errorDetails: filter(state.errorDetails, settings.keepErrors),
        touched: filter(state.touched, settings.keepTouched),
        validating: {},
        schemaValidating: false,
      };
      if (!keepDirty) {
        // A full reset starts a new lifecycle; a background data refresh does not.
        inactive.current.clear();
        lifecycle.current++;
        submitted.current = false;
        lock.current = null;
        Object.assign(patch, {
          submitError: undefined,
          isSubmitting: false,
          isSubmitSuccessful: false,
          submitCount: settings.keepSubmitCount ? state.submitCount : 0,
          resetCount: state.resetCount + 1,
        });
      }
      set(patch);
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
      pendingPaths.current = new Set();
      stopRuns((p) => affects(p, path));
      const state = get();
      const next = setPath(state.values, path, getPath(baseline.current, path));
      set({
        values: next,
        dirty: recomputeDirty(state.dirty, baseline.current, next, path),
        submitError: undefined,
        fieldResets: {
          ...state.fieldResets,
          [path]: (state.fieldResets[path] ?? 0) + 1,
        },
      });
      clearMeta(path, settings.keepError, settings.keepTouched);
    },
  );
  const unregister = useMemoizedFn(
    (path: FieldPath<T>, settings: { keepValue?: boolean } = {}) => {
      inactive.current.add(path);
      clearTimeout(validationTimer.current);
      pendingPaths.current = new Set();
      stopRuns((p) => under(p, path) || under(path, p));
      for (const key of [...fieldRules.current.keys()])
        if (under(key, path)) fieldRules.current.delete(key);
      clearMeta(path);
      if (!settings.keepValue) {
        const state = get();
        const next = unsetPath(state.values, path);
        set({
          values: next,
          dirty: recomputeDirty(state.dirty, baseline.current, next, path),
        });
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
    const errors = get().errorDetails;
    const candidates = [...nodes.current]
      .filter(([path]) => errors[path])
      .sort((a, b) => (a[1].compareDocumentPosition(b[1]) & 2 ? 1 : -1));
    return candidates.some(([path]) => focusField(path as FieldPath<T>));
  });
  const register = <P extends FieldPath<T>>(
    path: P,
    settings: RegisterOptions<FieldValue<T, P>, T> = {},
  ) => {
    watch(`value:${path}`, (state) => getPath(state.values, path));
    watch(`error:${path}`, (state) => state.errorDetails[path]);
    const rules = pickRules(settings as FieldRules);
    // Several inputs may share a path (radio groups); only rule-bearing ones write.
    if (rules) fieldRules.current.set(path, rules);
    const state = get();
    const value = getPath(state.values, path);
    const error = state.errorDetails[path];
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
    const errorId = errorIdOf(path);
    return {
      id: fieldId(path, choice),
      name: path,
      ref: getFieldRef(path),
      value: controlled,
      checked,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? errorId : undefined,
      "aria-errormessage": error ? errorId : undefined,
      "aria-required": rules?.required ? true : undefined,
      onChange: (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const input = event.target;
        const latest = getPath(get().values, path);
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
        else if (settings.setValueAs) next = settings.setValueAs(input.value);
        else if (settings.valueAsNumber)
          next = input.value === "" ? undefined : Number(input.value);
        else if (typeof latest === "number")
          next = input.value === "" ? Number.NaN : Number(input.value);
        else next = input.value;
        changed(setPath(get().values, path, next), path);
      },
      onBlur: () => blurField(path),
    };
  };
  const getErrorProps = (path: FieldPath<T>) => ({
    id: errorIdOf(path),
    "aria-live": "polite" as const,
  });
  const getFieldId = (path: FieldPath<T>, value?: string) =>
    fieldId(path, value);
  const isFieldDirty = (path: FieldPath<T>) => {
    watch("dirty", (state) => state.dirty);
    return Object.keys(get().dirty).some((key) => under(key, path));
  };

  // ---- Persistence.
  const persistence = useMemoizedFn(() => {
    const persist = config.current.persist;
    const storage = persist ? resolveStorage(persist.storage) : null;
    return persist && storage ? { persist, storage } : null;
  });
  const readDraft = useMemoizedFn((): T | undefined => {
    const target = persistence();
    if (!target) return undefined;
    try {
      const raw = target.storage.getItem(target.persist.key);
      if (!raw) return undefined;
      const draft: unknown = JSON.parse(raw);
      if (!draft || typeof draft !== "object") return undefined;
      const current = get().values;
      let next = { ...current, ...draft } as T;
      for (const path of target.persist.exclude ?? [])
        next = setPath(next, path, getPath(current, path));
      return next;
    } catch {
      return undefined;
    }
  });
  const saveDraft = useMemoizedFn(() => {
    const target = persistence();
    if (!target) return;
    let data: unknown = get().values;
    for (const path of target.persist.exclude ?? [])
      data = unsetPath(data, path);
    try {
      target.storage.setItem(target.persist.key, JSON.stringify(data));
    } catch {
      /* Quota or serialization failures must not interrupt editing. */
    }
  });
  const clearPersisted = useMemoizedFn(() => {
    clearTimeout(persistTimer.current);
    persistTimer.current = undefined;
    const target = persistence();
    try {
      target?.storage.removeItem(target.persist.key);
    } catch {
      /* Storage may be unavailable (privacy mode). */
    }
  });
  useEffect(() => {
    const target = persistence();
    if (!target) return;
    const draft = readDraft();
    if (draft) changed(draft, undefined, { shouldValidate: false });
    let last = get().values;
    const unsubscribe = store.subscribe(() => {
      const values = get().values;
      if (values === last) return;
      last = values;
      clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(
        () => {
          persistTimer.current = undefined;
          saveDraft();
        },
        Math.max(0, target.persist.debounce ?? 300),
      );
    });
    return () => {
      unsubscribe();
      // Flush the last edit so leaving the page within the debounce window keeps it.
      if (persistTimer.current !== undefined) {
        clearTimeout(persistTimer.current);
        persistTimer.current = undefined;
        saveDraft();
      }
    };
  }, [options.persist?.key, options.persist?.storage]);

  // ---- External / asynchronous values.
  const [loadVersion, setLoadVersion] = useState(0);
  useEffect(() => {
    const load = config.current.loadValues;
    if (!load) return;
    const controller = new AbortController();
    set({ isLoading: true, loadError: undefined });
    Promise.resolve()
      .then(() => load({ signal: controller.signal }))
      .then(
        (loaded) => {
          if (controller.signal.aborted) return;
          reset(loaded);
          // An unsaved local draft wins over freshly loaded server data.
          const draft = readDraft();
          if (draft) changed(draft, undefined, { shouldValidate: false });
          set({ isLoading: false });
        },
        (error) => {
          if (!controller.signal.aborted)
            set({ isLoading: false, loadError: error });
        },
      );
    return () => controller.abort();
  }, [loadVersion]);
  const reloadValues = useMemoizedFn(() => setLoadVersion((n) => n + 1));
  const syncedValues = useRef(options.values);
  useEffect(() => {
    const next = options.values;
    if (next === undefined || equal(syncedValues.current, next)) return;
    syncedValues.current = next;
    reset(next, {
      keepDirtyValues: config.current.resetOptions?.keepDirtyValues,
    });
  });

  // ---- Submission.
  const handleSubmit =
    <R = T>(
      callback: (values: R) => void | Promise<void>,
      second?: SubmitOptions<T, R>["onInvalid"] | SubmitOptions<T, R>,
    ) =>
    (event?: { preventDefault(): void }): Promise<boolean> => {
      event?.preventDefault();
      if (lock.current) return lock.current;
      const settings: SubmitOptions<T, R> =
        typeof second === "function" ? { onInvalid: second } : (second ?? {});
      submitted.current = true;
      const state = get();
      set({
        isSubmitting: true,
        submitError: undefined,
        submitCount: state.submitCount + 1,
        isSubmitSuccessful: false,
      });
      const generation = lifecycle.current;
      const promise = (async () => {
        try {
          let valid = await runValidation();
          // Values changed during async validation: validate the latest values.
          while (valid === "stale" && generation === lifecycle.current)
            valid = await runValidation();
          if (generation !== lifecycle.current) return false;
          if (!valid) {
            if (config.current.shouldFocusError) focusFirstError();
            const details = get().errorDetails;
            await settings.onInvalid?.(
              messagesOf(details) as FormErrors<T>,
              details as FormErrorDetails<T>,
            );
            return false;
          }
          const values = get().values;
          const payload = settings.transform
            ? await settings.transform(values)
            : (values as unknown as R);
          await callback(payload);
          if (mounted.current && generation === lifecycle.current) {
            set({ isSubmitSuccessful: true });
            if (config.current.persist?.clearOnSubmit !== false)
              clearPersisted();
          }
          return true;
        } catch (error) {
          if (mounted.current && generation === lifecycle.current)
            set({ submitError: error });
          return false;
        } finally {
          if (mounted.current && generation === lifecycle.current) {
            set({ isSubmitting: false });
            lock.current = null;
          }
        }
      })();
      lock.current = promise;
      return promise;
    };

  // ---- Field arrays and isolated field subscriptions.
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
      const remap = <V>(record: Readonly<Record<string, V>>) => {
        const result: Record<string, V> = {};
        for (const [key, value] of Object.entries(record)) {
          // Only an existing array index changes; the field suffix is retained.
          const mapped = remapKey(key);
          if (mapped !== null) result[mapped] = value;
        }
        return result;
      };
      inactive.current = new Set(
        [...inactive.current].flatMap((key) => {
          const mapped = remapKey(key);
          return mapped === null ? [] : [mapped];
        }),
      );
      fieldRules.current = new Map(
        [...fieldRules.current].flatMap(([key, rules]) => {
          const mapped = remapKey(key);
          return mapped === null ? [] : [[mapped, rules] as const];
        }),
      );
      const state = get();
      set({
        errorDetails: remap(state.errorDetails),
        touched: remap(state.touched),
      });
      changed(setPath(get().values, path, next), path);
    },
  );
  const setArrayRules = useMemoizedFn((path: string, rules?: FieldRules) => {
    if (rules) arrayRules.current.set(path, rules);
    else arrayRules.current.delete(path);
  });
  const control = useRef<FormControl<T> | null>(null);
  if (!control.current) {
    control.current = {
      subscribe: store.subscribe,
      read: (path) => {
        const state = get();
        return {
          value: getPath(state.values, path),
          error: state.errorDetails[path]?.message,
          touched: !!state.touched[path],
        };
      },
      setValue: (path, value) => setFieldValue(path, value),
      blur: (path) => blurField(path),
    };
    internals.set(control.current, {
      store: store as unknown as FormStore<object>,
      commitArray,
      setArrayRules,
    });
  }

  // Getters subscribe this component only to the state it reads, so fields
  // rendered through useFormField/useWatch do not re-render the whole form.
  return {
    control: control.current,
    get values(): T {
      watch("values", (state) => state.values);
      return get().values;
    },
    get errors(): FormErrors<T> {
      watch("errors", (state) => state.errorDetails);
      return messagesOf(get().errorDetails) as FormErrors<T>;
    },
    get errorDetails(): FormErrorDetails<T> {
      watch("errors", (state) => state.errorDetails);
      return get().errorDetails as FormErrorDetails<T>;
    },
    get touched(): Partial<Record<FieldPath<T>, boolean>> {
      watch("touched", (state) => state.touched);
      return get().touched as Partial<Record<FieldPath<T>, boolean>>;
    },
    get dirtyFields(): Partial<Record<FieldPath<T>, true>> {
      watch("dirty", (state) => state.dirty);
      return get().dirty as Partial<Record<FieldPath<T>, true>>;
    },
    get isDirty(): boolean {
      watch("isDirty", (state) => Object.keys(state.dirty).length > 0);
      return Object.keys(get().dirty).length > 0;
    },
    get validatingFields(): Partial<Record<FieldPath<T>, true>> {
      watch("validating", (state) => state.validating);
      return get().validating as Partial<Record<FieldPath<T>, true>>;
    },
    get isValidating(): boolean {
      const busy = (state: FormState<T>) =>
        state.schemaValidating || Object.keys(state.validating).length > 0;
      watch("isValidating", busy);
      return busy(get());
    },
    get isSubmitting(): boolean {
      watch("isSubmitting", (state) => state.isSubmitting);
      return get().isSubmitting;
    },
    get submitError(): unknown {
      watch("submitError", (state) => state.submitError);
      return get().submitError;
    },
    get submitCount(): number {
      watch("submitCount", (state) => state.submitCount);
      return get().submitCount;
    },
    get isSubmitSuccessful(): boolean {
      watch("isSubmitSuccessful", (state) => state.isSubmitSuccessful);
      return get().isSubmitSuccessful;
    },
    get resetCount(): number {
      watch("resetCount", (state) => state.resetCount);
      return get().resetCount;
    },
    get isLoading(): boolean {
      watch("isLoading", (state) => state.isLoading);
      return get().isLoading;
    },
    get loadError(): unknown {
      watch("loadError", (state) => state.loadError);
      return get().loadError;
    },
    setFieldValue,
    setValues,
    setFieldTouched,
    setFieldError,
    setErrors,
    register,
    getErrorProps,
    getFieldId,
    isFieldDirty,
    resetField,
    unregister,
    getFieldRef,
    focusField,
    focusFirstError,
    validate,
    handleSubmit,
    reset,
    reloadValues,
    clearPersisted,
  };
}
export type FormApi<T extends object> = ReturnType<typeof useForm<T>>;

function useFormSelector<T extends object, R>(
  control: FormControl<T>,
  key: string,
  select: (state: FormState<T>) => R,
  isEqual: (a: R, b: R) => boolean = Object.is,
): R {
  const store = internalsOf(control).store as unknown as FormStore<T>;
  const cache = useRef<{ state: FormState<T>; key: string; value: R } | null>(
    null,
  );
  const getSnapshot = () => {
    const state = store.get();
    const previous = cache.current;
    if (previous && previous.key === key) {
      if (previous.state === state) return previous.value;
      const value = select(state);
      if (isEqual(previous.value, value)) {
        cache.current = { state, key, value: previous.value };
        return previous.value;
      }
      cache.current = { state, key, value };
      return value;
    }
    const value = select(state);
    cache.current = { state, key, value };
    return value;
  };
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
const shallowEqual = <V extends object>(a: V, b: V) =>
  sameRecord(a as Record<string, unknown>, b as Record<string, unknown>);

/** Subscribes to one value (or the whole form) without re-rendering the form root. */
export function useWatch<T extends object>(control: FormControl<T>): T;
export function useWatch<T extends object, P extends FieldPath<T>>(
  control: FormControl<T>,
  path: P,
): FieldValue<T, P>;
export function useWatch<T extends object>(
  control: FormControl<T>,
  path?: string,
): unknown {
  return useFormSelector(control, `watch:${path ?? ""}`, (state) =>
    path === undefined ? state.values : getPath(state.values, path),
  );
}

export interface FieldArrayOptions<Item> {
  /** Stable record identity (e.g. `item => item.id`) instead of generated IDs. */
  getKey?: (item: Item, index: number) => string | number;
  /** Array-level rules: required (non-empty), minLength, maxLength, validate. */
  rules?: Pick<
    FieldRules<Item[]>,
    "required" | "minLength" | "maxLength" | "validate"
  >;
}
export function useFieldArray<T extends object, P extends FieldPath<T>>(
  form: FormApi<T>,
  name: P & (FieldValue<T, P> extends readonly unknown[] ? P : never),
  options: FieldArrayOptions<
    FieldValue<T, P> extends readonly (infer I)[] ? I : never
  > = {},
) {
  type Item = FieldValue<T, P> extends readonly (infer I)[] ? I : never;
  const prefix = useId();
  const sequence = useRef(0);
  const ids = useRef<string[]>([]);
  const adapter = internalsOf(form.control);
  const raw = useFormSelector(form.control, `array:${name}`, (state) =>
    getPath(state.values, name),
  );
  const resetVersion = useFormSelector(
    form.control,
    `array-reset:${name}`,
    (state) =>
      `${state.resetCount}:${Object.entries(state.fieldResets).reduce(
        (sum, [parent, version]) => sum + (under(name, parent) ? version : 0),
        0,
      )}`,
  );
  const generation = useRef(resetVersion);
  const items: Item[] = Array.isArray(raw) ? (raw as Item[]) : [];
  if (generation.current !== resetVersion) {
    ids.current = [];
    generation.current = resetVersion;
  }
  while (ids.current.length < items.length)
    ids.current.push(`${prefix}-${sequence.current++}`);
  ids.current = ids.current.slice(0, items.length);
  const values = useLatest(items);
  const rules = options.rules;
  useBrowserLayoutEffect(() => {
    adapter.setArrayRules(name, rules as FieldRules | undefined);
  });
  useBrowserLayoutEffect(
    () => () => adapter.setArrayRules(name, undefined),
    [adapter, name],
  );
  const commit = (next: Item[], mapping: readonly (number | null)[]) => {
    values.current = next;
    adapter.commitArray(name, next, mapping);
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
      mapping.map((i) => values.current[i]!),
      mapping,
    );
  });
  const move = useMemoizedFn((from: number, to: number) => {
    if (!valid(from) || !valid(to) || from === to) return;
    const mapping = values.current.map((_, i) => i);
    mapping.splice(to, 0, mapping.splice(from, 1)[0]!);
    ids.current.splice(to, 0, ids.current.splice(from, 1)[0]!);
    commit(
      mapping.map((i) => values.current[i]!),
      mapping,
    );
  });
  const swap = useMemoizedFn((a: number, b: number) => {
    if (!valid(a) || !valid(b) || a === b) return;
    const mapping = values.current.map((_, i) => i);
    [mapping[a], mapping[b]] = [mapping[b]!, mapping[a]!];
    [ids.current[a], ids.current[b]] = [ids.current[b]!, ids.current[a]!];
    commit(
      mapping.map((i) => values.current[i]!),
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
  const getKey = options.getKey;
  return {
    fields: items.map((value, index) => ({
      id: getKey ? String(getKey(value, index)) : ids.current[index]!,
      value,
    })),
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

export function useFormField<T extends object, P extends FieldPath<T>>(
  control: FormControl<T>,
  path: P,
) {
  const field = useFormSelector(
    control,
    `field:${path}`,
    (state) => ({
      value: getPath(state.values, path),
      error: state.errorDetails[path]?.message,
      touched: !!state.touched[path],
      dirty: Object.keys(state.dirty).some((key) => under(key, path)),
      validating: !!state.validating[path],
    }),
    shallowEqual,
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
