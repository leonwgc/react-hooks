import * as React from "react";

import { useForm } from "../../../src";

function Feature2() {
  const form = useForm({
    initialValues: { name: "", email: "" },
    mode: "onBlur",
    validators: {
      name: (value) => (value.trim() ? undefined : "请填写姓名"),
      email: (value) => (value.includes("@") ? undefined : "邮箱格式不正确"),
    },
  });
  return (
    <>
      <button type="button" onClick={() => form.reset()}>
        清空并重置
      </button>
      <label>
        姓名
        <input {...form.register("name")} />
      </label>
      <small>{form.errors.name ?? (form.touched.name ? "✓" : "未交互")}</small>
      <label>
        邮箱
        <input {...form.register("email")} />
      </label>
      <small>
        {form.errors.email ?? (form.touched.email ? "✓" : "未交互")}
      </small>
      <output>当前错误：{JSON.stringify(form.errors)}</output>
    </>
  );
}

export default Feature2;
