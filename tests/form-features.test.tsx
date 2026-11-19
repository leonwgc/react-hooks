import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { memo, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  standardSchema,
  useFieldArray,
  useForm,
  useFormField,
  useWatch,
  yupSchema,
  type FormControl,
  type SchemaContext,
  type StandardSchemaLike,
} from "../src";

describe("render isolation", () => {
  it("does not re-render the form root for fields rendered through useFormField", () => {
    type Values = { first: string; second: string };
    let rootRenders = 0;
    const Field = memo(function Field({
      control,
      name,
    }: {
      control: FormControl<Values>;
      name: keyof Values;
    }) {
      const field = useFormField(control, name);
      return (
        <input
          aria-label={name}
          value={field.value}
          onChange={(e) => field.setValue(e.target.value)}
        />
      );
    });
    function Demo() {
      rootRenders++;
      const form = useForm<Values>({
        initialValues: { first: "", second: "" },
      });
      return (
        <>
          <Field control={form.control} name="first" />
          <Field control={form.control} name="second" />
          <span data-testid="submitting">{String(form.isSubmitting)}</span>
        </>
      );
    }
    render(<Demo />);
    const before = rootRenders;
    fireEvent.change(screen.getByLabelText("first"), {
      target: { value: "a" },
    });
    fireEvent.change(screen.getByLabelText("first"), {
      target: { value: "ab" },
    });
    expect(rootRenders).toBe(before);
    expect(screen.getByLabelText("first")).toHaveProperty("value", "ab");
  });
  it("re-renders only for registered paths and state the render read", () => {
    let renders = 0;
    let api!: ReturnType<typeof useForm<{ a: string; b: string }>>;
    function Demo() {
      renders++;
      api = useForm({ initialValues: { a: "", b: "" } });
      return <input aria-label="a" {...api.register("a")} />;
    }
    render(<Demo />);
    const before = renders;
    act(() => api.setFieldValue("b", "changed"));
    expect(renders).toBe(before);
    act(() => api.setFieldValue("a", "changed"));
    expect(renders).toBe(before + 1);
    expect(screen.getByLabelText("a")).toHaveProperty("value", "changed");
  });
  it("useWatch subscribes to one path or the whole form", () => {
    const { result } = renderHook(() => {
      const form = useForm({ initialValues: { a: 1, b: { c: 2 } } });
      return {
        form,
        a: useWatch(form.control, "a"),
        all: useWatch(form.control),
      };
    });
    act(() => result.current.form.setFieldValue("a", 5));
    expect(result.current.a).toBe(5);
    expect(result.current.all).toEqual({ a: 5, b: { c: 2 } });
  });
});

describe("dirty tracking", () => {
  it("tracks dirty leaves incrementally and clears them when values return", () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "a", profile: { city: "x" }, tags: ["t"] },
      }),
    );
    act(() => result.current.setFieldValue("profile.city", "y"));
    expect(result.current.dirtyFields).toEqual({ "profile.city": true });
    expect(result.current.isFieldDirty("profile")).toBe(true);
    expect(result.current.isFieldDirty("name")).toBe(false);
    act(() => result.current.setFieldValue("tags", ["t", "u"]));
    expect(result.current.dirtyFields).toEqual({
      "profile.city": true,
      "tags.1": true,
    });
    act(() => result.current.setFieldValue("profile.city", "x"));
    act(() => result.current.setFieldValue("tags", ["t"]));
    expect(result.current.isDirty).toBe(false);
  });
  it("shouldDirty: false moves the baseline so a programmatic value stays clean", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" } }),
    );
    act(() =>
      result.current.setFieldValue("name", "loaded", { shouldDirty: false }),
    );
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.setFieldValue("name", "edited"));
    expect(result.current.isDirty).toBe(true);
    act(() => result.current.reset());
    expect(result.current.values.name).toBe("loaded");
  });
});

describe("validation engine", () => {
  it("passes an AbortSignal that aborts when the field changes", async () => {
    let signal!: AbortSignal;
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        validators: {
          name: (_value, _values, context) => {
            signal = context.signal;
            return new Promise<string | undefined>(() => {});
          },
        },
      }),
    );
    act(() => {
      void result.current.validate(["name"]);
    });
    expect(result.current.validatingFields).toEqual({ name: true });
    act(() => result.current.setFieldValue("name", "x"));
    expect(signal.aborted).toBe(true);
    expect(result.current.validatingFields).toEqual({});
    expect(result.current.isValidating).toBe(false);
  });
  it("validates fields concurrently without dropping earlier results", async () => {
    const resolvers: Record<string, (value: string) => void> = {};
    const slow = (path: string) => () =>
      new Promise<string>((resolve) => (resolvers[path] = resolve));
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "", b: "" },
        mode: "onBlur",
        validators: { a: slow("a"), b: slow("b") },
      }),
    );
    act(() => result.current.register("a").onBlur());
    act(() => result.current.register("b").onBlur());
    expect(result.current.validatingFields).toEqual({ a: true, b: true });
    await act(async () => {
      resolvers.b!("b error");
      resolvers.a!("a error");
    });
    expect(result.current.errors).toEqual({ a: "a error", b: "b error" });
    expect(result.current.isValidating).toBe(false);
  });
  it("applies wildcard validators to every array item", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { rows: [{ name: "ok" }, { name: "" }, { name: "" }] },
        validators: {
          "rows.*.name": (value) => (value ? undefined : "required"),
        },
      }),
    );
    await act(async () => {
      expect(await result.current.validate()).toBe(false);
    });
    expect(result.current.errors).toEqual({
      "rows.1.name": "required",
      "rows.2.name": "required",
    });
  });
  it("supports register rules, aria wiring and criteriaMode all", async () => {
    function Demo() {
      const form = useForm({
        initialValues: { code: "", age: 10 },
        criteriaMode: "all",
      });
      const code = form.register("code", {
        required: "必填",
        minLength: { value: 3, message: "至少 3 位" },
        pattern: /^\d+$/,
      });
      return (
        <>
          <input aria-label="code" {...code} />
          <input
            aria-label="age"
            type="number"
            {...form.register("age", { valueAsNumber: true, min: 18 })}
          />
          <span {...form.getErrorProps("code")}>{form.errors.code}</span>
          <button onClick={() => void form.validate()}>validate</button>
          <output>{JSON.stringify(form.errorDetails)}</output>
        </>
      );
    }
    render(<Demo />);
    const input = screen.getByLabelText("code");
    expect(input.getAttribute("aria-required")).toBe("true");
    fireEvent.change(input, { target: { value: "ab" } });
    await act(async () => fireEvent.click(screen.getByText("validate")));
    const details = JSON.parse(screen.getByRole("status").textContent!);
    expect(details.code).toMatchObject({
      type: "minLength",
      message: "至少 3 位",
      types: { minLength: "至少 3 位", pattern: "格式不正确" },
    });
    expect(details.age).toMatchObject({ type: "min", message: "不能小于 18" });
    const describedBy = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)?.textContent).toBe("至少 3 位");
    expect(input.id).toBeTruthy();
  });
  it("accepts FieldError objects and boolean outcomes from validators", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "", b: "" },
        validators: {
          a: () => ({ type: "taken", message: "已被占用" }),
          b: () => false,
        },
      }),
    );
    await act(async () => {
      await result.current.validate();
    });
    expect(result.current.errorDetails.a).toEqual({
      type: "taken",
      message: "已被占用",
    });
    expect(result.current.errors.b).toBe("校验失败");
  });
  it("setErrors writes server errors in bulk and can replace existing ones", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { a: "", b: "" } }),
    );
    act(() => result.current.setFieldError("a", "local"));
    act(() => result.current.setErrors({ b: "taken" }));
    expect(result.current.errors).toEqual({ a: "local", b: "taken" });
    expect(result.current.errorDetails.b?.type).toBe("server");
    act(() => result.current.setErrors({ b: "only" }, { replace: true }));
    expect(result.current.errors).toEqual({ b: "only" });
  });
  it("passes selected paths to the schema", async () => {
    const schema = vi.fn(
      async (values: { a: string; b: string }, _context: SchemaContext) => ({
        ...(values.a ? {} : { a: "a required" }),
        ...(values.b ? {} : { b: "b required" }),
      }),
    );
    const { result } = renderHook(() =>
      useForm({ initialValues: { a: "", b: "" }, schema }),
    );
    await act(async () => {
      await result.current.validate(["a"]);
    });
    expect(schema.mock.calls[0]?.[1].paths).toEqual(["a"]);
    expect(result.current.errors).toEqual({ a: "a required" });
  });
});

describe("value options", () => {
  it("setValueAs converts input text and setFieldValue honours shouldTouch/shouldValidate", async () => {
    const validator = vi.fn((value: string) =>
      value ? undefined : "required",
    );
    let api!: ReturnType<typeof useForm<{ tags: string; name: string }>>;
    function Demo() {
      api = useForm({
        initialValues: { tags: "", name: "x" },
        validators: { name: validator },
      });
      return (
        <input
          aria-label="tags"
          {...api.register("tags", { setValueAs: (raw) => raw.toUpperCase() })}
        />
      );
    }
    render(<Demo />);
    fireEvent.change(screen.getByLabelText("tags"), {
      target: { value: "ab" },
    });
    expect(api.values.tags).toBe("AB");
    await act(async () => {
      api.setFieldValue("name", "", {
        shouldValidate: true,
        shouldTouch: true,
      });
    });
    expect(api.errors.name).toBe("required");
    expect(api.touched.name).toBe(true);
  });
  it("valueAsNumber stores undefined for an empty number input", () => {
    let api!: ReturnType<typeof useForm<{ age?: number }>>;
    function Demo() {
      api = useForm<{ age?: number }>({ initialValues: { age: 3 } });
      return (
        <input
          aria-label="age"
          type="number"
          {...api.register("age", { valueAsNumber: true })}
        />
      );
    }
    render(<Demo />);
    fireEvent.change(screen.getByLabelText("age"), { target: { value: "" } });
    expect(api.values.age).toBeUndefined();
    fireEvent.change(screen.getByLabelText("age"), { target: { value: "42" } });
    expect(api.values.age).toBe(42);
  });
});

describe("lifecycle", () => {
  it("loads values asynchronously and can reload them", async () => {
    let version = 0;
    const loadValues = vi.fn(async () => ({ name: `server ${++version}` }));
    const { result } = renderHook(() =>
      useForm({ initialValues: { name: "" }, loadValues }),
    );
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.values.name).toBe(`server ${version}`);
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.reloadValues());
    await waitFor(() =>
      expect(result.current.values.name).toBe(`server ${version}`),
    );
    expect(version).toBeGreaterThan(1);
  });
  it("exposes load failures", async () => {
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        loadValues: async () => {
          throw new Error("offline");
        },
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.loadError).toMatchObject({ message: "offline" });
  });
  it("syncs external values and keeps user edits with keepDirtyValues", () => {
    const { result, rerender } = renderHook(
      ({ values }) =>
        useForm({
          initialValues: { title: "", body: "" },
          values,
          resetOptions: { keepDirtyValues: true },
        }),
      { initialProps: { values: { title: "v1", body: "v1" } } },
    );
    expect(result.current.values).toEqual({ title: "v1", body: "v1" });
    act(() => result.current.setFieldValue("title", "mine"));
    rerender({ values: { title: "v2", body: "v2" } });
    expect(result.current.values).toEqual({ title: "mine", body: "v2" });
    expect(result.current.dirtyFields).toEqual({ title: true });
  });
  it("tracks submit count, success, onInvalid and transform", async () => {
    const onValid = vi.fn();
    const onInvalid = vi.fn();
    const { result } = renderHook(() =>
      useForm({
        initialValues: { name: "" },
        validators: {
          name: (value) => (value.trim() ? undefined : "required"),
        },
      }),
    );
    await act(async () => {
      expect(await result.current.handleSubmit(onValid, onInvalid)()).toBe(
        false,
      );
    });
    expect(onInvalid).toHaveBeenCalledWith(
      { name: "required" },
      { name: { type: "validate", message: "required" } },
    );
    expect(result.current.submitCount).toBe(1);
    expect(result.current.isSubmitSuccessful).toBe(false);
    act(() => result.current.setFieldValue("name", "  Ada  "));
    await act(async () => {
      await result.current.handleSubmit(onValid, {
        transform: (values) => ({ name: values.name.trim() }),
      })();
    });
    expect(onValid).toHaveBeenCalledWith({ name: "Ada" });
    expect(result.current.submitCount).toBe(2);
    expect(result.current.isSubmitSuccessful).toBe(true);
    act(() => result.current.reset());
    expect(result.current.submitCount).toBe(0);
    expect(result.current.isSubmitSuccessful).toBe(false);
  });
});

describe("field arrays", () => {
  it("supports array rules and record keys", async () => {
    const { result } = renderHook(() => {
      const form = useForm({
        initialValues: { rows: [{ id: "a", name: "A" }] },
      });
      const array = useFieldArray(form, "rows", {
        getKey: (row) => row.id,
        rules: { minLength: { value: 2, message: "至少两行" } },
      });
      return { form, array };
    });
    expect(result.current.array.fields[0]!.id).toBe("a");
    await act(async () => {
      expect(await result.current.form.validate()).toBe(false);
    });
    expect(result.current.form.errors.rows).toBe("至少两行");
    act(() => result.current.array.append({ id: "b", name: "B" }));
    await act(async () => {
      expect(await result.current.form.validate()).toBe(true);
    });
    act(() =>
      result.current.form.setValues({
        rows: [
          { id: "b", name: "B" },
          { id: "a", name: "A" },
        ],
      }),
    );
    expect(result.current.array.fields.map((f) => f.id)).toEqual(["b", "a"]);
  });
  it("drops registered rules of removed rows", async () => {
    function Demo() {
      const form = useForm({
        initialValues: { rows: [{ name: "x" }, { name: "" }] },
      });
      const array = useFieldArray(form, "rows");
      return (
        <>
          {array.fields.map((row, index) => (
            <input
              key={row.id}
              aria-label={`row ${index}`}
              {...form.register(`rows.${index}.name`, { required: true })}
            />
          ))}
          <button onClick={() => array.remove(1)}>remove</button>
          <button onClick={() => void form.validate()}>validate</button>
          <output>{JSON.stringify(form.errors)}</output>
        </>
      );
    }
    render(<Demo />);
    fireEvent.click(screen.getByText("remove"));
    await act(async () => fireEvent.click(screen.getByText("validate")));
    expect(screen.getByRole("status").textContent).toBe("{}");
  });
});

describe("schema adapters", () => {
  it("standardSchema maps issues to field paths", async () => {
    const schema: StandardSchemaLike = {
      "~standard": {
        version: 1,
        vendor: "test",
        validate: (value) =>
          (value as { rows: { name: string }[] }).rows[0]!.name
            ? { value }
            : {
                issues: [
                  {
                    message: "name required",
                    path: ["rows", { key: 0 }, "name"],
                  },
                ],
              },
      },
    };
    const { result } = renderHook(() =>
      useForm({
        initialValues: { rows: [{ name: "" }] },
        schema: standardSchema(schema),
      }),
    );
    await act(async () => {
      await result.current.validate();
    });
    expect(result.current.errors).toEqual({ "rows.0.name": "name required" });
  });
  it("yupSchema maps ValidationError.inner with bracket paths", async () => {
    const schema = {
      validate: async () => {
        throw {
          name: "ValidationError",
          message: "2 errors",
          inner: [
            {
              name: "ValidationError",
              path: "rows[0].name",
              type: "required",
              message: "required",
            },
            {
              name: "ValidationError",
              path: "email",
              type: "email",
              message: "bad email",
            },
          ],
        };
      },
    };
    const { result } = renderHook(() =>
      useForm({
        initialValues: { rows: [{ name: "" }], email: "" },
        schema: yupSchema(schema),
      }),
    );
    await act(async () => {
      await result.current.validate();
    });
    expect(result.current.errorDetails).toEqual({
      "rows.0.name": { type: "required", message: "required" },
      email: { type: "email", message: "bad email" },
    });
  });
});

describe("persistence", () => {
  it("restores, saves (excluding paths) and clears drafts after submit", async () => {
    vi.useFakeTimers();
    localStorage.setItem("draft", JSON.stringify({ title: "restored" }));
    const { result } = renderHook(() =>
      useForm({
        initialValues: { title: "", secret: "s" },
        persist: { key: "draft", debounce: 100, exclude: ["secret"] },
      }),
    );
    expect(result.current.values).toEqual({ title: "restored", secret: "s" });
    expect(result.current.isDirty).toBe(true);
    act(() => result.current.setFieldValue("title", "edited"));
    act(() => vi.advanceTimersByTime(100));
    expect(JSON.parse(localStorage.getItem("draft")!)).toEqual({
      title: "edited",
    });
    await act(async () => {
      await result.current.handleSubmit(() => {})();
    });
    expect(localStorage.getItem("draft")).toBeNull();
  });
  it("flushes a pending draft on unmount", () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() =>
      useForm({ initialValues: { title: "" }, persist: { key: "flush" } }),
    );
    act(() => result.current.setFieldValue("title", "unsaved"));
    unmount();
    expect(JSON.parse(localStorage.getItem("flush")!)).toEqual({
      title: "unsaved",
    });
  });
});

it("keeps submit state isolated when a parent re-renders", () => {
  function Parent() {
    const [, setTick] = useState(0);
    const form = useForm({ initialValues: { a: "" } });
    return (
      <>
        <button onClick={() => setTick((n) => n + 1)}>tick</button>
        <output>{form.submitCount}</output>
      </>
    );
  }
  render(<Parent />);
  fireEvent.click(screen.getByText("tick"));
  expect(screen.getByRole("status").textContent).toBe("0");
});
