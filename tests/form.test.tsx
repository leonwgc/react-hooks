import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useForm,
  useFieldArray,
  type FieldPath,
  type FieldValue,
} from "../src";
import { getPath, setPath } from "../src/form/path";
describe("forms", () => {
  it("types top-level and nested values and validates dependent fields", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { password: "", confirm: "", profile: { name: "" } },
        validators: {
          password: (value) => (value.length < 3 ? "short" : undefined),
          confirm: (value, values) =>
            value !== values.password ? "mismatch" : undefined,
        },
      }),
    );
    act(() => {
      result.current.setFieldValue("password", "secret");
      result.current.setFieldValue("profile.name", "Lin");
    });
    await act(async () => {
      expect(await result.current.validate()).toBe(false);
    });
    expect(result.current.errors.confirm).toBe("mismatch");
    expect(result.current.values.profile.name).toBe("Lin");
    act(() => result.current.setFieldValue("confirm", "secret"));
    await act(async () => {
      expect(await result.current.validate()).toBe(true);
    });
    expect(result.current.isDirty).toBe(true);
    act(() => result.current.reset());
    expect(result.current.isDirty).toBe(false);
    expect(result.current.values.profile.name).toBe("");
  });
  it("discards outdated async validation and revalidates on changes after submission", async () => {
    const pending = new Map<string, (message: string | undefined) => void>();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "old" },
        validators: {
          name: (value) =>
            new Promise<string | undefined>((resolve) =>
              pending.set(value, resolve),
            ),
        },
      }),
    );
    const save = vi.fn();
    let old!: Promise<boolean>;
    act(() => {
      old = result.current.handleSubmit(save)();
    });
    act(() => result.current.setFieldValue("name", "new"));
    await act(async () => {
      pending.get("new")?.(undefined);
      await Promise.resolve();
    });
    expect(result.current.errors).toEqual({});
    await act(async () => {
      pending.get("old")?.("already taken");
      await Promise.resolve();
      await Promise.resolve();
    });
    // The submission revalidates the latest values instead of failing silently.
    await act(async () => {
      pending.get("new")?.(undefined);
      await expect(old).resolves.toBe(true);
    });
    expect(save).toHaveBeenCalledWith({ name: "new" });
    expect(result.current.errors).toEqual({});
    expect(result.current.isValidating).toBe(false);
  });
  it("prevents duplicate submissions and exposes submission errors", async () => {
    let release!: () => void;
    const save = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const { result } = renderHook(() =>
      useForm({ initialValues: { value: "hello" } }),
    );
    let a!: Promise<boolean>, b!: Promise<boolean>;
    act(() => {
      a = result.current.handleSubmit(save)();
      b = result.current.handleSubmit(save)();
    });
    expect(a).toBe(b);
    await waitFor(() => expect(save).toHaveBeenCalledTimes(1));
    await act(async () => {
      release();
      expect(await a).toBe(true);
    });
    expect(result.current.isSubmitting).toBe(false);
    await act(async () => {
      expect(
        await result.current.handleSubmit(async () => {
          throw new Error("save failed");
        })(),
      ).toBe(false);
    });
    expect(result.current.submitError).toBeInstanceOf(Error);
  });
  it("reset invalidates pending validation and establishes a new baseline", async () => {
    let release!: (value: string) => void;
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "old" },
        validators: {
          name: () =>
            new Promise<string>((resolve) => {
              release = resolve;
            }),
        },
      }),
    );
    let promise!: Promise<boolean>;
    act(() => {
      promise = result.current.validate();
    });
    act(() => result.current.reset({ name: "loaded" }));
    await act(async () => {
      release("stale");
      await promise;
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
    expect(result.current.values.name).toBe("loaded");
  });
  it("preserves array identities during moves and deletes the correct row", () => {
    const { result } = renderHook(() => {
      const form = useForm({
        initialValues: { contacts: [{ name: "a" }, { name: "b" }] },
      });
      return { form, array: useFieldArray(form, "contacts") };
    });
    const ids = result.current.array.fields.map((field) => field.id);
    act(() => result.current.array.move(0, 1));
    expect(result.current.array.fields.map((field) => field.id)).toEqual([
      ids[1],
      ids[0],
    ]);
    expect(result.current.form.values.contacts.map((row) => row.name)).toEqual([
      "b",
      "a",
    ]);
    act(() => result.current.array.remove(0));
    expect(result.current.array.fields[0].id).toBe(ids[0]);
    act(() => result.current.array.append({ name: "c" }));
    expect(result.current.form.values.contacts.map((row) => row.name)).toEqual([
      "a",
      "c",
    ]);
    const beforeReset = result.current.array.fields[0].id;
    act(() => result.current.form.reset());
    expect(result.current.array.fields[0].id).not.toBe(beforeReset);
  });
  it("removes deleted array validation metadata and ignores out-of-range operations", () => {
    const { result } = renderHook(() => {
      const form = useForm({ initialValues: { rows: [{ text: "a" }] } });
      return { form, array: useFieldArray(form, "rows") };
    });
    act(() => {
      result.current.form.setFieldError("rows.0.text", "bad");
      result.current.form.setFieldTouched("rows.0.text");
    });
    act(() => result.current.array.remove(9));
    expect(result.current.form.values.rows).toHaveLength(1);
    act(() => result.current.array.remove(0));
    expect(result.current.form.errors).toEqual({});
    expect(result.current.form.touched["rows.0.text"]).toBeUndefined();
  });
  it("updates nested paths immutably and prevents prototype pollution", () => {
    const source = { a: [{ b: 1 }] };
    const next = setPath(source, "a.0.b", 2);
    expect(source.a[0].b).toBe(1);
    expect(getPath(next, "a.0.b")).toBe(2);
    expect(() => setPath({}, "__proto__.polluted", true)).toThrow(
      "Invalid field path",
    );
  });
});
// Compile-time regression checks: illegal paths and values must remain errors.
type Values = { profile: { age: number }; rows: { name: string }[] };
const path: FieldPath<Values> = "rows.0.name";
const value: FieldValue<Values, "profile.age"> = 42;
void path;
void value;
// @ts-expect-error unknown path
const invalidPath: FieldPath<Values> = "profile.unknown";
// @ts-expect-error wrong field value
const invalidValue: FieldValue<Values, "profile.age"> = "42";
void invalidPath;
void invalidValue;
