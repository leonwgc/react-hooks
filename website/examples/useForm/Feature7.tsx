import * as React from "react";

import { useForm } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature7() {
  const [log, setLog] = React.useState("尚未提交");
  const form = useForm({
    initialValues: { email: "", tags: "" },
    validators: {
      email: (value) => (value.includes("@") ? undefined : "邮箱格式不正确"),
    },
  });
  const submit = form.handleSubmit(
    async (payload: { email: string; tags: string[] }) => {
      await delay(new AbortController().signal, 300);
      if (payload.email === "taken@example.com") {
        form.setErrors({ email: "该邮箱已注册（服务端返回）" });
        throw new Error("服务端拒绝");
      }
      setLog(`提交成功：${JSON.stringify(payload)}`);
    },
    {
      onInvalid: (errors) =>
        setLog(`校验失败：${Object.keys(errors).join("、")}`),
      transform: (values) => ({
        email: values.email.trim().toLowerCase(),
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    },
  );
  return (
    <form onSubmit={submit} noValidate>
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "提交中…" : "提交"}
      </button>
      <label>
        邮箱（输入 taken@example.com 模拟服务端错误）
        <input {...form.register("email")} />
      </label>
      <small>{form.errors.email}</small>
      <label>
        标签（逗号分隔，提交前转换为数组）
        <input {...form.register("tags")} />
      </label>
      <output>
        submitCount：{form.submitCount} · isSubmitSuccessful：
        {String(form.isSubmitSuccessful)}
      </output>
      <p>{log}</p>
    </form>
  );
}

export default Feature7;
