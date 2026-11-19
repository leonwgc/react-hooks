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
  if (keys.some((key) => key === "__proto__" || key === ""))
    throw new Error("Invalid field path");
  return keys;
}
const own = (value: object, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key);
function shallowCopy(value: object): Record<string, unknown> | unknown[] {
  if (Array.isArray(value)) return [...value];
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? { ...value }
    : Object.assign(Object.create(prototype), value);
}
export function getPath(value: unknown, path: string): unknown {
  return parts(path).reduce<unknown>(
    (result, key) =>
      result !== null && typeof result === "object" && own(result, key)
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
    const copy =
      current && typeof current === "object"
        ? shallowCopy(current)
        : /^\d+$/.test(key)
          ? []
          : {};
    const child = own(copy, key) ? Reflect.get(copy, key) : undefined;
    Reflect.defineProperty(copy, key, {
      value: visit(child, index + 1),
      writable: true,
      enumerable: true,
      configurable: true,
    });
    return copy;
  };
  return visit(value, 0) as T;
}

export function unsetPath<T>(value: T, path: string): T {
  const keys = parts(path);
  const visit = (current: unknown, index: number): unknown => {
    if (!current || typeof current !== "object" || !own(current, keys[index]))
      return current;
    const copy = shallowCopy(current);
    if (index === keys.length - 1) {
      // Removing an array element must not leave a sparse hole.
      if (Array.isArray(copy) && /^\d+$/.test(keys[index]))
        copy.splice(Number(keys[index]), 1);
      else Reflect.deleteProperty(copy, keys[index]);
    } else
      Reflect.set(
        copy,
        keys[index],
        visit(Reflect.get(copy, keys[index]), index + 1),
      );
    return copy;
  };
  return visit(value, 0) as T;
}
