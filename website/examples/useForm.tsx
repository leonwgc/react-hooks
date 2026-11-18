import * as React from "react";
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

function Enhanced1() {
  const f = useForm({
    initialValues: { name: "", email: "" },
    shouldFocusError: true,
    validators: {
      name: (v) => (v ? undefined : "请输入姓名"),
      email: (v) => (v.includes("@") ? undefined : "请输入邮箱"),
    },
  });
  return (
    <form className="demo-stack" onSubmit={f.handleSubmit(() => {})}>
      <label>
        聚焦姓名
        <input {...f.register("name")} />
      </label>
      <label>
        聚焦邮箱
        <input {...f.register("email")} />
      </label>
      <button type="submit">校验并定位错误</button>
      <button type="button" onClick={() => f.resetField("name")}>
        只重置姓名
      </button>
      <output>{JSON.stringify(f.errors)}</output>
    </form>
  );
}

function Enhanced2() {
  const [shown, setShown] = React.useState(true),
    [remove, setRemove] = React.useState(false);
  const f = useForm<{ extra?: string }>({
    initialValues: { extra: "附加内容" },
    shouldUnregister: remove,
    validators: { extra: (v) => (v ? undefined : "附加内容必填") },
  });
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={remove}
          onChange={(e) => setRemove(e.target.checked)}
        />
        卸载时移除字段
      </label>
      <button onClick={() => setShown((x) => !x)}>切换附加字段</button>
      {shown && (
        <label>
          附加内容
          <input {...f.register("extra")} />
        </label>
      )}
      <button onClick={() => void f.validate()}>校验条件字段</button>
      <output>
        值 {JSON.stringify(f.values)} · 错误 {JSON.stringify(f.errors)}
      </output>
    </>
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
      <Scenario
        title="单字段重置与错误聚焦"
        description="提交空值时自动聚焦首个错误字段；只重置姓名，不影响另一字段的编辑。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="条件字段卸载策略"
        description="勾选移除策略后，隐藏字段会注销其值与校验；默认隐藏后仍保留。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
