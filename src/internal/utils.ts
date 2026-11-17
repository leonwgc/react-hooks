export function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (!Array.isArray(a) && Object.getPrototypeOf(a) !== Object.prototype)
    return false;
  const ak = Object.keys(a),
    bk = Object.keys(b);
  return (
    ak.length === bk.length &&
    ak.every(
      (k) =>
        Object.prototype.hasOwnProperty.call(b, k) &&
        equal(Reflect.get(a, k), Reflect.get(b, k)),
    )
  );
}

export function abortError() {
  return new DOMException("Operation cancelled", "AbortError");
}
export function isAbort(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}
export type Target<T> =
  T | { readonly current: T | null } | (() => T | null) | null;
export function resolveTarget<T>(target: Target<T>): T | null {
  if (typeof target === "function") return (target as () => T | null)();
  if (target && typeof target === "object" && "current" in target)
    return target.current;
  return target as T | null;
}
