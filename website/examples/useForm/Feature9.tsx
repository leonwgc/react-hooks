import * as React from "react";

import { standardSchema, useForm, type StandardSchemaLike } from "../../../src";

// Zod (>=3.24)、Valibot (>=1)、ArkType 的 schema 都实现了 Standard Schema，
// 可直接写 standardSchema(z.object({...}))。这里手写一个最小实现以免引入依赖。
type Signup = { email: string; password: string; confirm: string };
const signupSchema: StandardSchemaLike = {
  "~standard": {
    version: 1,
    vendor: "demo",
    validate: (input) => {
      const value = input as Signup;
      const issues: { message: string; path: string[] }[] = [];
      if (!value.email.includes("@"))
        issues.push({ message: "邮箱格式不正确", path: ["email"] });
      if (value.password.length < 8)
        issues.push({ message: "密码至少 8 位", path: ["password"] });
      if (value.confirm !== value.password)
        issues.push({ message: "两次密码不一致", path: ["confirm"] });
      return issues.length ? { issues } : { value };
    },
  },
};

function Feature9() {
  const form = useForm<Signup>({
    initialValues: { email: "", password: "", confirm: "" },
    mode: "onBlur",
    schema: standardSchema(signupSchema),
  });
  return (
    <form onSubmit={form.handleSubmit(() => {})} noValidate>
      <button type="submit">提交整表校验</button>
      {(["email", "password", "confirm"] as const).map((name) => (
        <React.Fragment key={name}>
          <label>
            {{ email: "邮箱", password: "密码", confirm: "确认密码" }[name]}
            <input
              type={name === "email" ? "email" : "password"}
              {...form.register(name)}
            />
          </label>
          <small>{form.errors[name]}</small>
        </React.Fragment>
      ))}
      <output>
        失焦只采纳当前字段的 schema 错误：{JSON.stringify(form.errors)}
      </output>
    </form>
  );
}

export default Feature9;
