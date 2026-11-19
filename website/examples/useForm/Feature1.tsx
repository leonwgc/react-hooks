import * as React from "react";

import { useForm } from "../../../src";

function Feature1() {
  const form = useForm({
    initialValues: {
      plan: "basic",
      channels: ["email"] as string[],
      regions: [] as string[],
      attachments: [] as File[],
    },
  });
  const plans = [
    ["basic", "基础版"],
    ["pro", "专业版"],
  ];
  const channels = [
    ["email", "邮件"],
    ["sms", "短信"],
    ["push", "推送"],
  ];
  return (
    <>
      <button type="button" onClick={() => form.reset()}>
        恢复初始值
      </button>
      <fieldset>
        <legend>套餐（radio 组）</legend>
        {plans.map(([value, label]) => (
          <label className="check" key={value}>
            <input type="radio" {...form.register("plan", { value })} />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>通知渠道（复选框组）</legend>
        {channels.map(([value, label]) => (
          <label className="check" key={value}>
            <input type="checkbox" {...form.register("channels", { value })} />
            {label}
          </label>
        ))}
      </fieldset>
      <label>
        服务区域（多选，按住 Ctrl/⌘ 选择多项）
        <select multiple {...form.register("regions")}>
          <option value="north">华北</option>
          <option value="east">华东</option>
          <option value="south">华南</option>
        </select>
      </label>
      <label>
        附件（值为 File[]）
        <input
          type="file"
          multiple
          {...form.register("attachments", { type: "file" })}
        />
      </label>
      <pre>
        {JSON.stringify(
          {
            ...form.values,
            attachments: form.values.attachments.map((file) => file.name),
          },
          null,
          2,
        )}
      </pre>
    </>
  );
}

export default Feature1;
