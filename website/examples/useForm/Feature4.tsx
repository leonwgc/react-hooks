import * as React from "react";

import { useForm } from "../../../src";

import { delay } from "../../demos/webHelpers";

const taken = ["admin", "root"];

function Feature4() {
  const [log, setLog] = React.useState<string[]>([]);
  const form = useForm({
    initialValues: { username: "", email: "" },
    mode: "onChange",
    validateDebounce: 200,
    validators: {
      username: async (value, _values, { signal }) => {
        if (!value) return "请填写用户名";
        signal.addEventListener("abort", () =>
          setLog((l) => [...l.slice(-4), `已中止对 "${value}" 的查重`]),
        );
        await delay(signal, 800);
        setLog((l) => [...l.slice(-4), `"${value}" 查重完成`]);
        return taken.includes(value) ? "用户名已被占用" : undefined;
      },
      email: async (value, _values, { signal }) => {
        await delay(signal, 500);
        return value.includes("@") ? undefined : "邮箱格式不正确";
      },
    },
  });
  return (
    <>
      <button onClick={() => form.setFieldValue("username", "admin")}>
        填入已占用的用户名 admin
      </button>
      <label>
        用户名（试试 admin、root）
        <input {...form.register("username")} />
      </label>
      <small>
        {form.validatingFields.username
          ? "查重中…"
          : (form.errors.username ?? "✓")}
      </small>
      <label>
        邮箱（与用户名同时校验）
        <input {...form.register("email")} />
      </label>
      <small>
        {form.validatingFields.email ? "校验中…" : (form.errors.email ?? "✓")}
      </small>
      <output>{log.join(" → ") || "连续输入会中止上一次查重"}</output>
    </>
  );
}

export default Feature4;
