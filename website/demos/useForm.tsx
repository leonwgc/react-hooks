import { useState } from "react";
import { useForm } from "../../src";
export default function Demo() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"onSubmit" | "onBlur" | "onChange">(
    "onSubmit",
  );
  const form = useForm({
    initialValues: { username: "", password: "", confirm: "" },
    mode,
    validateDebounce: 250,
    dependencies: { confirm: ["password"] },
    schema: (values) =>
      values.username.toLowerCase() === "root"
        ? { username: "Schema 校验：不能使用 root" }
        : {},
    validators: {
      username: async (value) => {
        if (value.trim().length < 3) return "用户名至少需要 3 个字符";
        await new Promise((resolve) => setTimeout(resolve, 350));
        return value.toLowerCase() === "admin" ? "该用户名已被使用" : undefined;
      },
      password: (value) =>
        value.length < 6 ? "密码至少需要 6 个字符" : undefined,
      confirm: (value, values) =>
        value !== values.password ? "两次输入的密码不一致" : undefined,
    },
  });
  return (
    <form
      className="demo-stack"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMessage(`${values.username}，演示注册成功！未发送或保存你的密码。`);
      })}
    >
      <label>
        校验时机
        <select
          value={mode}
          onChange={(e) =>
            setMode(
              e.target.value === "onChange"
                ? "onChange"
                : e.target.value === "onBlur"
                  ? "onBlur"
                  : "onSubmit",
            )
          }
        >
          <option value="onSubmit">提交时</option>
          <option value="onBlur">失焦时</option>
          <option value="onChange">输入时（250ms 防抖）</option>
        </select>
      </label>
      <label>
        用户名
        <input
          {...form.register("username")}
          autoComplete="off"
          placeholder="试试 admin，查看异步校验"
          aria-describedby="username-error"
        />
      </label>
      <small id="username-error" className="error">
        {form.errors.username}
      </small>
      <label>
        密码
        <input
          {...form.register("password")}
          type="password"
          autoComplete="new-password"
          placeholder="至少 6 个字符"
          aria-describedby="password-error"
        />
      </label>
      <small id="password-error" className="error">
        {form.errors.password}
      </small>
      <label>
        确认密码
        <input
          {...form.register("confirm")}
          type="password"
          autoComplete="new-password"
          aria-describedby="confirm-error"
        />
      </label>
      <small id="confirm-error" className="error">
        {form.errors.confirm}
      </small>
      <div className="demo-row">
        <button disabled={form.isSubmitting}>
          {form.isValidating
            ? "正在校验…"
            : form.isSubmitting
              ? "提交中…"
              : "创建演示账户"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            form.reset();
            setMessage("");
          }}
        >
          重置
        </button>
      </div>
      <output aria-live="polite">
        {message ||
          (form.isDirty
            ? "表单有未保存的修改"
            : "填写后提交，体验字段和跨字段校验")}
      </output>
    </form>
  );
}
