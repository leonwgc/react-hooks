type Depth = [never, 0, 1, 2, 3, 4, 5];
export type FieldPath<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends readonly (infer Item)[]
    ? `${number}` | `${number}.${FieldPath<Item, Depth[D]>}`
    : T extends object
      ? {
          [K in keyof T & string]: T[K] extends Date | Function
            ? K
            : | K
              | (NonNullable<T[K]> extends object
                  ? `${K}.${FieldPath<NonNullable<T[K]>, Depth[D]>}`
                  : never);
        }[keyof T & string]
      : never;
export type FieldValue<
  T,
  P extends string,
> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? FieldValue<NonNullable<T[Head]>, Tail>
    : T extends readonly (infer Item)[]
      ? FieldValue<Item, Tail>
      : never
  : P extends keyof T
    ? T[P]
    : T extends readonly (infer Item)[]
      ? Item
      : never;
function parts(path: string) {
  const keys = path.split(".");
  if (
    keys.some(
      (key) =>
        ["__proto__", "prototype", "constructor"].includes(key) || key === "",
    )
  )
    throw new Error("Invalid field path");
  return keys;
}
export function getPath(value: unknown, path: string): unknown {
  return parts(path).reduce<unknown>(
    (result, key) =>
      result !== null && typeof result === "object"
        ? Reflect.get(result, key)
        : undefined,
    value,
  );
}
export function setPath<T>(value: T, path: string, next: unknown): T {
  const keys = parts(path);
  const visit = (current: unknown, index: number): unknown => {
    if (index === keys.length) return next;
    const key = keys[index];
    const copy: Record<string, unknown> | unknown[] = Array.isArray(current)
      ? [...current]
      : current && typeof current === "object"
        ? { ...current }
        : /^\d+$/.test(key)
          ? []
          : {};
    Reflect.set(copy, key, visit(Reflect.get(copy, key), index + 1));
    return copy;
  };
  return visit(value, 0) as T;
}

export function unsetPath<T>(value: T, path: string): T {
  const keys = parts(path);
  const visit = (current: unknown, index: number): unknown => {
    if (
      !current ||
      typeof current !== "object" ||
      !Object.prototype.hasOwnProperty.call(current, keys[index])
    )
      return current;
    const copy = Array.isArray(current) ? [...current] : { ...current };
    if (index === keys.length - 1) Reflect.deleteProperty(copy, keys[index]);
    else
      Reflect.set(
        copy,
        keys[index],
        visit(Reflect.get(copy, keys[index]), index + 1),
      );
    return copy;
  };
  return visit(value, 0) as T;
}
