var e=`import * as React from "react";
import { useForm } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const f = useForm<{ profile: { email: string } }>({
    initialValues: { profile: { email: "" } },
    mode: "onBlur",
    validators: {
      "profile.email": (value) =>
        value.includes("@") ? undefined : "请输入有效邮箱",
    },
  });
  return (
    <>
      <label>
        嵌套邮箱
        <input
          {...f.register("profile.email")}
          aria-invalid={!!f.errors["profile.email"]}
        />
      </label>
      <button onClick={() => void f.validate(["profile.email"])}>
        只校验邮箱
      </button>
      <button
        onClick={() => f.reset({ profile: { email: "demo@example.com" } })}
      >
        载入已有资料
      </button>
      <output>
        {f.errors["profile.email"] ?? "邮箱无错误"} · {JSON.stringify(f.values)}
      </output>
    </>
  );
}
function Case2() {
  const f = useForm({ initialValues: { name: "演示用户" } });
  return (
    <form
      className="demo-stack"
      onSubmit={f.handleSubmit(async () => {
        throw Error("模拟服务暂时不可用");
      })}
    >
      <label>
        提交姓名
        <input {...f.register("name")} />
      </label>
      <button type="submit">提交并模拟失败</button>
      <button
        type="button"
        onClick={() => f.setFieldError("name", "服务端提示：名称已存在")}
      >
        设置字段业务错误
      </button>
      <button type="button" onClick={() => f.reset()}>
        重置提交状态
      </button>
      {f.errors.name && <p role="alert">{f.errors.name}</p>}
      {!!f.submitError && <p role="alert">{String(f.submitError)}</p>}
      <output>{f.isSubmitting ? "正在提交" : "等待操作"}</output>
    </form>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="嵌套字段与局部校验"
        description="通过点号路径注册嵌套值，只校验指定字段，并显示 touched 与错误。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="提交失败与服务端字段错误"
        description="模拟提交失败后展示 submitError，也可把业务错误绑定到字段；重置会清理状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};