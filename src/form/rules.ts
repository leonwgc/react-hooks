import { abortError } from "../internal/utils.js";

export interface FieldError {
  /** Rule or validator name, e.g. "required", "pattern", "validate", "schema", "server". */
  type: string;
  message: string;
  /** All failed rules for this field when `criteriaMode: "all"`. */
  types?: Record<string, string>;
}
/** Falsy / `true` = valid; a string, `false` or a FieldError = invalid. */
export type ValidationOutcome =
  string | FieldError | boolean | null | undefined;
export type ValidationResult = ValidationOutcome | Promise<ValidationOutcome>;
export interface ValidatorContext {
  /** Aborted when the field changes, is reset or a newer validation starts. */
  signal: AbortSignal;
  path: string;
}
export type Validator<V, T> = (
  value: V,
  values: T,
  context: ValidatorContext,
) => ValidationResult;

export type RuleValue<V> = V | { value: V; message: string };
export interface FieldRules<V = unknown, T = unknown> {
  required?: boolean | string;
  min?: RuleValue<number>;
  max?: RuleValue<number>;
  /** Minimum string length or array item count. */
  minLength?: RuleValue<number>;
  maxLength?: RuleValue<number>;
  pattern?: RuleValue<RegExp>;
  validate?: Validator<V, T> | Record<string, Validator<V, T>>;
}
export const ruleKeys = [
  "required",
  "min",
  "max",
  "minLength",
  "maxLength",
  "pattern",
  "validate",
] as const;

export type Check = (
  value: unknown,
  values: unknown,
  context: ValidatorContext,
) => Promise<FieldError | undefined>;

export function normalizeOutcome(
  outcome: ValidationOutcome,
  type: string,
): FieldError | undefined {
  if (typeof outcome === "string")
    return outcome ? { type, message: outcome } : undefined;
  if (outcome === false) return { type, message: "校验失败" };
  if (outcome && typeof outcome === "object" && "message" in outcome)
    return { ...outcome, type: outcome.type || type };
  return undefined;
}

const ruleValue = <V>(rule: RuleValue<V>): V =>
  rule &&
  typeof rule === "object" &&
  "value" in rule &&
  !(rule instanceof RegExp)
    ? rule.value
    : (rule as V);
const ruleMessage = <V>(rule: RuleValue<V>, fallback: string) =>
  rule &&
  typeof rule === "object" &&
  "message" in rule &&
  !(rule instanceof RegExp)
    ? rule.message
    : fallback;
const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === false ||
  (typeof value === "number" && Number.isNaN(value)) ||
  (Array.isArray(value) && value.length === 0);

export function rulesCheck(rules: FieldRules, all: boolean): Check {
  return async (value, values, context) => {
    const failures: FieldError[] = [];
    // Returns true when evaluation should stop (first-error mode).
    const fail = (type: string, message: string) => {
      failures.push({ type, message });
      return !all;
    };
    const empty = isEmpty(value);
    const done = () => {
      if (!failures.length) return undefined;
      const [first] = failures;
      return all
        ? {
            ...first!,
            types: Object.fromEntries(failures.map((f) => [f.type, f.message])),
          }
        : first;
    };
    if (rules.required && empty) {
      const message =
        typeof rules.required === "string" ? rules.required : "此项为必填项";
      if (fail("required", message)) return done();
    }
    if (!empty) {
      const number =
        typeof value === "number"
          ? value
          : typeof value === "string" &&
              value.trim() !== "" &&
              !Number.isNaN(Number(value))
            ? Number(value)
            : undefined;
      if (rules.min !== undefined && number !== undefined) {
        const min = ruleValue(rules.min);
        if (
          number < min &&
          fail("min", ruleMessage(rules.min, `不能小于 ${min}`))
        )
          return done();
      }
      if (rules.max !== undefined && number !== undefined) {
        const max = ruleValue(rules.max);
        if (
          number > max &&
          fail("max", ruleMessage(rules.max, `不能大于 ${max}`))
        )
          return done();
      }
      const length =
        typeof value === "string" || Array.isArray(value)
          ? value.length
          : undefined;
      if (rules.minLength !== undefined && length !== undefined) {
        const min = ruleValue(rules.minLength);
        if (
          length < min &&
          fail("minLength", ruleMessage(rules.minLength, `长度不能少于 ${min}`))
        )
          return done();
      }
      if (rules.maxLength !== undefined && length !== undefined) {
        const max = ruleValue(rules.maxLength);
        if (
          length > max &&
          fail("maxLength", ruleMessage(rules.maxLength, `长度不能超过 ${max}`))
        )
          return done();
      }
      if (rules.pattern !== undefined && typeof value === "string") {
        const pattern = ruleValue(rules.pattern);
        pattern.lastIndex = 0;
        if (
          !pattern.test(value) &&
          fail("pattern", ruleMessage(rules.pattern, "格式不正确"))
        )
          return done();
      }
    }
    if (rules.validate) {
      const entries =
        typeof rules.validate === "function"
          ? [["validate", rules.validate] as const]
          : Object.entries(rules.validate);
      for (const [type, validator] of entries) {
        const outcome = normalizeOutcome(
          await validator(value, values, context),
          type,
        );
        if (context.signal.aborted) throw abortError();
        if (outcome && fail(outcome.type, outcome.message)) return done();
      }
    }
    return done();
  };
}

/** Runs every check for one path; combines failures according to criteriaMode. */
export function combineChecks(checks: readonly Check[], all: boolean): Check {
  return async (value, values, context) => {
    let first: FieldError | undefined;
    const types: Record<string, string> = {};
    for (const check of checks) {
      const outcome = await check(value, values, context);
      if (context.signal.aborted) throw abortError();
      if (!outcome) continue;
      first ??= outcome;
      types[outcome.type] = outcome.message;
      Object.assign(types, outcome.types);
      if (!all) break;
    }
    return first && (all ? { ...first, types } : first);
  };
}

/** Expands `rows.*.name` against the current values into concrete paths. */
export function expandPattern(pattern: string, values: unknown): string[] {
  const segments = pattern.split(".");
  const out: string[] = [];
  const walk = (value: unknown, index: number, prefix: string[]) => {
    if (index === segments.length) {
      out.push(prefix.join("."));
      return;
    }
    const segment = segments[index]!;
    const container = value && typeof value === "object" ? value : undefined;
    if (segment === "*") {
      if (container)
        for (const key of Object.keys(container))
          walk(Reflect.get(container, key), index + 1, [...prefix, key]);
      return;
    }
    const child =
      container && Object.prototype.hasOwnProperty.call(container, segment)
        ? Reflect.get(container, segment)
        : undefined;
    walk(child, index + 1, [...prefix, segment]);
  };
  walk(values, 0, []);
  return out;
}

/** Resolves with STALE as soon as the signal aborts, even if the work ignores it. */
export const STALE = Symbol("stale");
export class SettleFailure {
  constructor(public readonly error: unknown) {}
}
export function settle<V>(
  work: () => Promise<V>,
  signal: AbortSignal,
): Promise<V | typeof STALE | SettleFailure> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve(STALE);
      return;
    }
    const abort = () => resolve(STALE);
    signal.addEventListener("abort", abort, { once: true });
    // Start synchronously (like a direct call) so validators begin immediately.
    let pending: Promise<V>;
    try {
      pending = Promise.resolve(work());
    } catch (error) {
      pending = Promise.reject(error);
    }
    pending
      .then(
        (value) => resolve(signal.aborted ? STALE : value),
        (error) => resolve(signal.aborted ? STALE : new SettleFailure(error)),
      )
      .finally(() => signal.removeEventListener("abort", abort));
  });
}
