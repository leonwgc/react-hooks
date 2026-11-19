import type { FieldError } from "./rules.js";

export type SchemaErrors = Partial<Record<string, string | FieldError>>;
export interface SchemaContext {
  /** Paths being validated; undefined means the whole form. */
  paths?: readonly string[];
  signal: AbortSignal;
}
export type FormSchema<T> = (
  values: T,
  context: SchemaContext,
) => SchemaErrors | Promise<SchemaErrors>;

/** Structural subset of the Standard Schema v1 spec (Zod ≥3.24, Valibot ≥1, ArkType ≥2). */
export interface StandardSchemaLike {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult | Promise<StandardSchemaResult>;
  };
}
type StandardSchemaResult =
  | { readonly value: unknown; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<
          PropertyKey | { readonly key: PropertyKey }
        >;
      }>;
    };

const segment = (part: PropertyKey | { readonly key: PropertyKey }) =>
  String(typeof part === "object" && part !== null ? part.key : part);

/** Adapts any Standard Schema (Zod, Valibot, ArkType…) to `useForm({ schema })`. */
export function standardSchema<T>(schema: StandardSchemaLike): FormSchema<T> {
  return async (values) => {
    const result = await schema["~standard"].validate(values);
    const errors: Record<string, FieldError> = {};
    for (const issue of result.issues ?? []) {
      const path = (issue.path ?? []).map(segment).join(".");
      errors[path] ??= { type: "schema", message: issue.message };
    }
    return errors;
  };
}

/** Structural subset of a Yup object schema. */
export interface YupSchemaLike {
  validate(value: unknown, options: { abortEarly: false }): Promise<unknown>;
}
interface YupValidationError {
  name: "ValidationError";
  path?: string;
  type?: string;
  message: string;
  inner?: YupValidationError[];
}
const isYupError = (error: unknown): error is YupValidationError =>
  !!error &&
  typeof error === "object" &&
  (error as { name?: unknown }).name === "ValidationError";
// Yup reports array indices as `rows[0].name`; forms use `rows.0.name`.
const yupPath = (path = "") =>
  path
    .replace(/\[(?:"([^"]*)"|(\d+))\]/g, (_, key, index) => `.${key ?? index}`)
    .replace(/^\./, "");

/** Adapts a Yup schema to `useForm({ schema })`; non-validation errors are rethrown. */
export function yupSchema<T>(schema: YupSchemaLike): FormSchema<T> {
  return async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
      return {};
    } catch (error) {
      if (!isYupError(error)) throw error;
      const errors: Record<string, FieldError> = {};
      const issues = error.inner?.length ? error.inner : [error];
      for (const issue of issues)
        errors[yupPath(issue.path)] ??= {
          type: issue.type ?? "schema",
          message: issue.message,
        };
      return errors;
    }
  };
}
