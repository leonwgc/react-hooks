import { memo, useRef } from "react";
import { useForm, useFormField, type FormControl } from "../../src";
type Profile = { name: string; note: string };
const Field = memo(function Field({
  control,
  name,
  label,
}: {
  control: FormControl<Profile>;
  name: keyof Profile;
  label: string;
}) {
  const field = useFormField(control, name);
  const renders = useRef(0);
  renders.current++;
  return (
    <label>
      {label}
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
        onBlur={field.onBlur}
        aria-invalid={!!field.error}
      />
      <small>{field.error ?? `当前字段渲染 ${renders.current} 次`}</small>
    </label>
  );
});
export default function Demo() {
  const form = useForm({
    initialValues: { name: "", note: "" },
    mode: "onChange",
    validators: {
      name: (value) => (value.length < 2 ? "名称至少 2 字符" : undefined),
    },
  });
  return (
    <div className="demo-stack">
      <Field control={form.control} name="name" label="订阅名称" />
      <Field control={form.control} name="note" label="订阅备注" />
      <small>
        稳定 control 配合
        React.memo；编辑名称时，备注字段不会因父表单更新而重新渲染。开发模式可能重复渲染用于检查。
      </small>
      <button onClick={() => form.reset()}>重置字段</button>
    </div>
  );
}
