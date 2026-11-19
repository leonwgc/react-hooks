import * as React from "react";

import {
  useForm,
  useFormField,
  useWatch,
  type FormControl,
} from "../../../src";

type Profile = { first: string; last: string };

const NameInput = React.memo(function NameInput({
  control,
  name,
  label,
}: {
  control: FormControl<Profile>;
  name: keyof Profile;
  label: string;
}) {
  const field = useFormField(control, name);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <label>
      {label}（渲染 {renders.current} 次{field.dirty ? "，已修改" : ""}）
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const FullName = React.memo(function FullName({
  control,
}: {
  control: FormControl<Profile>;
}) {
  const first = useWatch(control, "first");
  const last = useWatch(control, "last");
  return <output>预览：{`${last}${first}` || "（空）"}</output>;
});

function Feature10() {
  const form = useForm<Profile>({ initialValues: { first: "", last: "" } });
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <button
        onClick={() => form.setFieldValue("last", "王", { shouldDirty: false })}
      >
        程序化填入姓氏（shouldDirty: false）
      </button>
      <NameInput control={form.control} name="first" label="名" />
      <NameInput control={form.control} name="last" label="姓" />
      <FullName control={form.control} />
      <small>
        表单根组件渲染 {renders.current} 次。根组件没有读取
        values，修改任一字段只会重渲染对应输入框和预览。
      </small>
    </>
  );
}

export default Feature10;
