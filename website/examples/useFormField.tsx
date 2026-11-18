import * as React from "react";
import { useFormField, useForm } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const f = useForm({
    initialValues: { quantity: 1 },
    mode: "onBlur",
    validators: {
      quantity: (value) => (value < 1 ? "数量至少为 1" : undefined),
    },
  });
  const field = useFormField(f.control, "quantity");
  return (
    <>
      <label>
        订阅数量
        <input
          type="number"
          value={field.value}
          onChange={(e) => field.setValue(Number(e.target.value))}
          onBlur={field.onBlur}
        />
      </label>
      <button onClick={() => field.setValue(0)}>设置无效数量</button>
      <button onClick={field.onBlur}>触碰并校验数量</button>
      <output>
        touched {String(field.touched)} · {field.error ?? "无错误"}
      </output>
    </>
  );
}
function Case2() {
  const f = useForm({ initialValues: { settings: { nickname: "访客" } } });
  const field = useFormField(f.control, "settings.nickname");
  return (
    <>
      <label>
        订阅昵称
        <input
          value={field.value}
          onChange={(e) => field.setValue(e.target.value)}
          onBlur={field.onBlur}
        />
      </label>
      <button onClick={() => f.setFieldValue("settings.nickname", "管理员")}>
        父表单写入昵称
      </button>
      <button onClick={() => f.reset()}>父表单重置</button>
      <output>
        订阅值 {field.value} · 已触碰 {String(field.touched)}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自定义数值字段"
        description="直接使用 setValue 接入数字控件，失焦时触发该字段校验。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="嵌套路径与外部重置"
        description="订阅嵌套字段，父表单直接写入或重置后订阅者同步更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
