import * as React from "react";

import { useForm } from "../../../src";

function Feature3() {
  const form = useForm({
    initialValues: { username: "", age: 16, website: "" },
    criteriaMode: "all",
  });
  return (
    <form onSubmit={form.handleSubmit(() => {})} noValidate>
      <button type="submit">提交并显示全部规则错误</button>
      <label>
        用户名（必填、3–12 位小写字母或数字）
        <input
          {...form.register("username", {
            required: "请填写用户名",
            minLength: { value: 3, message: "至少 3 位" },
            maxLength: 12,
            pattern: {
              value: /^[a-z0-9]+$/,
              message: "只能包含小写字母和数字",
            },
          })}
        />
      </label>
      <small {...form.getErrorProps("username")}>
        {Object.values(form.errorDetails.username?.types ?? {}).join("；")}
      </small>
      <label>
        年龄（不小于 18）
        <input
          type="number"
          {...form.register("age", { valueAsNumber: true, min: 18 })}
        />
      </label>
      <small {...form.getErrorProps("age")}>{form.errors.age}</small>
      <label>
        个人主页（选填，填写时需以 https:// 开头）
        <input
          {...form.register("website", {
            validate: (value) =>
              !value || value.startsWith("https://") || "请使用 https 链接",
          })}
        />
      </label>
      <small {...form.getErrorProps("website")}>{form.errors.website}</small>
      <output>
        用户名输入框 aria-describedby →{" "}
        {form.errors.username
          ? form.getErrorProps("username").id
          : "（无错误时不关联）"}
      </output>
    </form>
  );
}

export default Feature3;
