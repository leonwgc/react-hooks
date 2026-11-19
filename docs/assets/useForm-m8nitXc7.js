import{t as e}from"./Scenario-ApRSINdu.js";import{n as t}from"./form-VX5FkX0R.js";import{D as n}from"./index-C6jdXK2z.js";import{r,t as i}from"./react-DvXU6kJ2.js";var a=n();function o(){let e=t({initialValues:{profile:{email:``}},mode:`onBlur`,validators:{"profile.email":e=>e.includes(`@`)?void 0:`请输入有效邮箱`}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`label`,{children:[`嵌套邮箱`,(0,a.jsx)(`input`,{...e.register(`profile.email`),"aria-invalid":!!e.errors[`profile.email`]})]}),(0,a.jsx)(`button`,{onClick:()=>void e.validate([`profile.email`]),children:`只校验邮箱`}),(0,a.jsx)(`button`,{onClick:()=>e.reset({profile:{email:`demo@example.com`}}),children:`载入已有资料`}),(0,a.jsxs)(`output`,{children:[e.errors[`profile.email`]??`邮箱无错误`,` · `,JSON.stringify(e.values)]})]})}var s=`import { useForm } from "../../../src";

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

export default Case1;
`;function c(){let e=t({initialValues:{name:`演示用户`}});return(0,a.jsxs)(`form`,{className:`demo-stack`,onSubmit:e.handleSubmit(async()=>{throw Error(`模拟服务暂时不可用`)}),children:[(0,a.jsxs)(`label`,{children:[`提交姓名`,(0,a.jsx)(`input`,{...e.register(`name`)})]}),(0,a.jsx)(`button`,{type:`submit`,children:`提交并模拟失败`}),(0,a.jsx)(`button`,{type:`button`,onClick:()=>e.setFieldError(`name`,`服务端提示：名称已存在`),children:`设置字段业务错误`}),(0,a.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`重置提交状态`}),e.errors.name&&(0,a.jsx)(`p`,{role:`alert`,children:e.errors.name}),!!e.submitError&&(0,a.jsx)(`p`,{role:`alert`,children:String(e.submitError)}),(0,a.jsx)(`output`,{children:e.isSubmitting?`正在提交`:`等待操作`})]})}var l=`import { useForm } from "../../../src";

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

export default Case2;
`;function u(){let e=t({initialValues:{name:``,email:``},shouldFocusError:!0,validators:{name:e=>e?void 0:`请输入姓名`,email:e=>e.includes(`@`)?void 0:`请输入邮箱`}});return(0,a.jsxs)(`form`,{className:`demo-stack`,onSubmit:e.handleSubmit(()=>{}),children:[(0,a.jsxs)(`label`,{children:[`聚焦姓名`,(0,a.jsx)(`input`,{...e.register(`name`)})]}),(0,a.jsxs)(`label`,{children:[`聚焦邮箱`,(0,a.jsx)(`input`,{...e.register(`email`)})]}),(0,a.jsx)(`button`,{type:`submit`,children:`校验并定位错误`}),(0,a.jsx)(`button`,{type:`button`,onClick:()=>e.resetField(`name`),children:`只重置姓名`}),(0,a.jsx)(`output`,{children:JSON.stringify(e.errors)})]})}var d=`import { useForm } from "../../../src";

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

export default Enhanced1;
`,f=r(i(),1);function p(){let[e,n]=f.useState(!0),[r,i]=f.useState(!1),o=t({initialValues:{extra:`附加内容`},shouldUnregister:r,validators:{extra:e=>e?void 0:`附加内容必填`}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`label`,{className:`check`,children:[(0,a.jsx)(`input`,{type:`checkbox`,checked:r,onChange:e=>i(e.target.checked)}),`卸载时移除字段`]}),(0,a.jsx)(`button`,{onClick:()=>n(e=>!e),children:`切换附加字段`}),e&&(0,a.jsxs)(`label`,{children:[`附加内容`,(0,a.jsx)(`input`,{...o.register(`extra`)})]}),(0,a.jsx)(`button`,{onClick:()=>void o.validate(),children:`校验条件字段`}),(0,a.jsxs)(`output`,{children:[`值 `,JSON.stringify(o.values),` · 错误 `,JSON.stringify(o.errors)]})]})}var m=`import * as React from "react";

import { useForm } from "../../../src";

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

export default Enhanced2;
`;function h(){let e=t({initialValues:{plan:`basic`,channels:[`email`],regions:[],attachments:[]}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`恢复初始值`}),(0,a.jsxs)(`fieldset`,{children:[(0,a.jsx)(`legend`,{children:`套餐（radio 组）`}),[[`basic`,`基础版`],[`pro`,`专业版`]].map(([t,n])=>(0,a.jsxs)(`label`,{className:`check`,children:[(0,a.jsx)(`input`,{type:`radio`,...e.register(`plan`,{value:t})}),n]},t))]}),(0,a.jsxs)(`fieldset`,{children:[(0,a.jsx)(`legend`,{children:`通知渠道（复选框组）`}),[[`email`,`邮件`],[`sms`,`短信`],[`push`,`推送`]].map(([t,n])=>(0,a.jsxs)(`label`,{className:`check`,children:[(0,a.jsx)(`input`,{type:`checkbox`,...e.register(`channels`,{value:t})}),n]},t))]}),(0,a.jsxs)(`label`,{children:[`服务区域（多选，按住 Ctrl/⌘ 选择多项）`,(0,a.jsxs)(`select`,{multiple:!0,...e.register(`regions`),children:[(0,a.jsx)(`option`,{value:`north`,children:`华北`}),(0,a.jsx)(`option`,{value:`east`,children:`华东`}),(0,a.jsx)(`option`,{value:`south`,children:`华南`})]})]}),(0,a.jsxs)(`label`,{children:[`附件（值为 File[]）`,(0,a.jsx)(`input`,{type:`file`,multiple:!0,...e.register(`attachments`,{type:`file`})})]}),(0,a.jsx)(`pre`,{children:JSON.stringify({...e.values,attachments:e.values.attachments.map(e=>e.name)},null,2)})]})}var g=`import * as React from "react";

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
`;function _(){let e=t({initialValues:{name:``,email:``},mode:`onBlur`,validators:{name:e=>e.trim()?void 0:`请填写姓名`,email:e=>e.includes(`@`)?void 0:`邮箱格式不正确`}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`清空并重置`}),(0,a.jsxs)(`label`,{children:[`姓名`,(0,a.jsx)(`input`,{...e.register(`name`)})]}),(0,a.jsx)(`small`,{children:e.errors.name??(e.touched.name?`✓`:`未交互`)}),(0,a.jsxs)(`label`,{children:[`邮箱`,(0,a.jsx)(`input`,{...e.register(`email`)})]}),(0,a.jsx)(`small`,{children:e.errors.email??(e.touched.email?`✓`:`未交互`)}),(0,a.jsxs)(`output`,{children:[`当前错误：`,JSON.stringify(e.errors)]})]})}var v=`import * as React from "react";

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
`;function y(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`嵌套字段与局部校验`,description:`通过点号路径注册嵌套值，只校验指定字段，并显示 touched 与错误。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:l,title:`提交失败与服务端字段错误`,description:`模拟提交失败后展示 submitError，也可把业务错误绑定到字段；重置会清理状态。`,children:(0,a.jsx)(c,{})}),(0,a.jsx)(e,{source:d,title:`单字段重置与错误聚焦`,description:`提交空值时自动聚焦首个错误字段；只重置姓名，不影响另一字段的编辑。`,children:(0,a.jsx)(u,{})}),(0,a.jsx)(e,{source:m,title:`条件字段卸载策略`,description:`勾选移除策略后，隐藏字段会注销其值与校验；默认隐藏后仍保留。`,children:(0,a.jsx)(p,{})}),(0,a.jsx)(e,{source:g,title:`单选组、复选框组、多选与文件`,description:`register 传入 value 绑定 radio 与复选框组，数组字段配合 select multiple，type: 'file' 时值为 File[]。`,children:(0,a.jsx)(h,{})}),(0,a.jsx)(e,{source:v,title:`失焦只校验当前字段`,description:`onBlur 模式下离开姓名只显示姓名错误，未交互的邮箱不会提前报错。`,children:(0,a.jsx)(_,{})})]})}export{y as default};