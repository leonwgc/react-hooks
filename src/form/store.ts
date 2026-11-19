import { equal } from "../internal/utils.js";
import { getPath } from "./path.js";
import type { FieldError } from "./rules.js";

export interface FormState<T> {
  values: T;
  errorDetails: Readonly<Record<string, FieldError>>;
  touched: Readonly<Record<string, boolean>>;
  /** Leaf paths whose value differs from the baseline. */
  dirty: Readonly<Record<string, true>>;
  validating: Readonly<Record<string, true>>;
  schemaValidating: boolean;
  isSubmitting: boolean;
  submitError: unknown;
  submitCount: number;
  isSubmitSuccessful: boolean;
  resetCount: number;
  /** Per-path resetField counters; field arrays regenerate identities from them. */
  fieldResets: Readonly<Record<string, number>>;
  isLoading: boolean;
  loadError: unknown;
}

export interface FormStore<T> {
  get(): FormState<T>;
  set(patch: Partial<FormState<T>>): void;
  subscribe(listener: () => void): () => void;
}

export function createFormStore<T>(initial: FormState<T>): FormStore<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(patch) {
      const keys = Object.keys(patch) as (keyof FormState<T>)[];
      if (keys.every((key) => Object.is(patch[key], state[key]))) return;
      state = { ...state, ...patch };
      for (const listener of [...listeners]) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const under = (path: string, parent: string) =>
  parent === "" || path === parent || path.startsWith(`${parent}.`);

const isContainer = (value: unknown): value is object => {
  if (Array.isArray(value)) return true;
  if (!value || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
const join = (path: string, key: string) => (path ? `${path}.${key}` : key);

function collectDirty(
  base: unknown,
  value: unknown,
  path: string,
  out: Record<string, true>,
) {
  const a = isContainer(base),
    b = isContainer(value);
  if (a && b) {
    if (Array.isArray(base) !== Array.isArray(value)) {
      if (path) out[path] = true;
      return;
    }
    const keys = new Set([...Object.keys(base), ...Object.keys(value)]);
    for (const key of keys)
      collectDirty(
        Reflect.get(base, key),
        Reflect.get(value, key),
        join(path, key),
        out,
      );
    return;
  }
  if (a || b) {
    const container = (a ? base : value) as object;
    const other = a ? value : base;
    const keys = Object.keys(container);
    // A container compared with a primitive (or an empty container that
    // appeared/disappeared) is dirty as a whole; otherwise report its leaves.
    if ((other !== undefined && other !== null) || !keys.length) {
      if (path) out[path] = true;
      return;
    }
    for (const key of keys)
      collectDirty(
        a ? Reflect.get(container, key) : undefined,
        a ? undefined : Reflect.get(container, key),
        join(path, key),
        out,
      );
    return;
  }
  if (!equal(base, value) && path) out[path] = true;
}

const sameKeys = (a: Record<string, true>, b: Record<string, true>) => {
  const left = Object.keys(a);
  return left.length === Object.keys(b).length && left.every((key) => b[key]);
};

/**
 * Recomputes dirty leaves incrementally: only the subtree touched by `path`
 * is diffed, so a keystroke costs O(field) instead of O(form).
 */
export function recomputeDirty(
  previous: Readonly<Record<string, true>>,
  baseline: unknown,
  values: unknown,
  path?: string,
): Readonly<Record<string, true>> {
  let root = path ?? "";
  if (root) {
    const parts = root.split(".");
    for (let index = 1; index < parts.length; index++) {
      const ancestor = parts.slice(0, index).join(".");
      if (previous[ancestor]) {
        root = ancestor;
        break;
      }
    }
  }
  const out: Record<string, true> = {};
  if (root)
    for (const key of Object.keys(previous))
      if (!under(key, root)) out[key] = true;
  collectDirty(
    root ? getPath(baseline, root) : baseline,
    root ? getPath(values, root) : values,
    root,
    out,
  );
  return sameKeys(out, previous as Record<string, true>) ? previous : out;
}

const messageCache = new WeakMap<object, Record<string, string>>();
/** Stable `path -> message` view of error details (same object for same input). */
export function messagesOf(details: Readonly<Record<string, FieldError>>) {
  let messages = messageCache.get(details);
  if (!messages) {
    messages = Object.fromEntries(
      Object.entries(details).map(([path, error]) => [path, error.message]),
    );
    messageCache.set(details, messages);
  }
  return messages;
}
