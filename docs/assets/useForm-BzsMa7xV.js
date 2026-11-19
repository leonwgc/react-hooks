import{t as e}from"./Scenario-lI9aBaLE.js";import{i as t,n,r}from"./form-BPPkl8Rn.js";import{D as i}from"./index-BH-UjxLV.js";import{r as a,t as o}from"./react-DvXU6kJ2.js";import{t as s}from"./webHelpers-C9HRgI6m.js";var c=e=>String(typeof e==`object`&&e?e.key:e);function l(e){return async t=>{let n=await e[`~standard`].validate(t),r={};for(let e of n.issues??[]){let t=(e.path??[]).map(c).join(`.`);r[t]??={type:`schema`,message:e.message}}return r}}var u=i();function d(){let e=n({initialValues:{profile:{email:``}},mode:`onBlur`,validators:{"profile.email":e=>e.includes(`@`)?void 0:`请输入有效邮箱`}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`label`,{children:[`嵌套邮箱`,(0,u.jsx)(`input`,{...e.register(`profile.email`),"aria-invalid":!!e.errors[`profile.email`]})]}),(0,u.jsx)(`button`,{onClick:()=>void e.validate([`profile.email`]),children:`只校验邮箱`}),(0,u.jsx)(`button`,{onClick:()=>e.reset({profile:{email:`demo@example.com`}}),children:`载入已有资料`}),(0,u.jsxs)(`output`,{children:[e.errors[`profile.email`]??`邮箱无错误`,` · `,JSON.stringify(e.values)]})]})}var f=`import { useForm } from "../../../src";

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
`;function p(){let e=n({initialValues:{name:`演示用户`}});return(0,u.jsxs)(`form`,{className:`demo-stack`,onSubmit:e.handleSubmit(async()=>{throw Error(`模拟服务暂时不可用`)}),children:[(0,u.jsxs)(`label`,{children:[`提交姓名`,(0,u.jsx)(`input`,{...e.register(`name`)})]}),(0,u.jsx)(`button`,{type:`submit`,children:`提交并模拟失败`}),(0,u.jsx)(`button`,{type:`button`,onClick:()=>e.setFieldError(`name`,`服务端提示：名称已存在`),children:`设置字段业务错误`}),(0,u.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`重置提交状态`}),e.errors.name&&(0,u.jsx)(`p`,{role:`alert`,children:e.errors.name}),!!e.submitError&&(0,u.jsx)(`p`,{role:`alert`,children:String(e.submitError)}),(0,u.jsx)(`output`,{children:e.isSubmitting?`正在提交`:`等待操作`})]})}var m=`import { useForm } from "../../../src";

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
`;function h(){let e=n({initialValues:{name:``,email:``},shouldFocusError:!0,validators:{name:e=>e?void 0:`请输入姓名`,email:e=>e.includes(`@`)?void 0:`请输入邮箱`}});return(0,u.jsxs)(`form`,{className:`demo-stack`,onSubmit:e.handleSubmit(()=>{}),children:[(0,u.jsxs)(`label`,{children:[`聚焦姓名`,(0,u.jsx)(`input`,{...e.register(`name`)})]}),(0,u.jsxs)(`label`,{children:[`聚焦邮箱`,(0,u.jsx)(`input`,{...e.register(`email`)})]}),(0,u.jsx)(`button`,{type:`submit`,children:`校验并定位错误`}),(0,u.jsx)(`button`,{type:`button`,onClick:()=>e.resetField(`name`),children:`只重置姓名`}),(0,u.jsx)(`output`,{children:JSON.stringify(e.errors)})]})}var g=`import { useForm } from "../../../src";

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
`,_=a(o(),1);function v(){let[e,t]=_.useState(!0),[r,i]=_.useState(!1),a=n({initialValues:{extra:`附加内容`},shouldUnregister:r,validators:{extra:e=>e?void 0:`附加内容必填`}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`label`,{className:`check`,children:[(0,u.jsx)(`input`,{type:`checkbox`,checked:r,onChange:e=>i(e.target.checked)}),`卸载时移除字段`]}),(0,u.jsx)(`button`,{onClick:()=>t(e=>!e),children:`切换附加字段`}),e&&(0,u.jsxs)(`label`,{children:[`附加内容`,(0,u.jsx)(`input`,{...a.register(`extra`)})]}),(0,u.jsx)(`button`,{onClick:()=>void a.validate(),children:`校验条件字段`}),(0,u.jsxs)(`output`,{children:[`值 `,JSON.stringify(a.values),` · 错误 `,JSON.stringify(a.errors)]})]})}var y=`import * as React from "react";

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
`;function b(){let e=n({initialValues:{plan:`basic`,channels:[`email`],regions:[],attachments:[]}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`恢复初始值`}),(0,u.jsxs)(`fieldset`,{children:[(0,u.jsx)(`legend`,{children:`套餐（radio 组）`}),[[`basic`,`基础版`],[`pro`,`专业版`]].map(([t,n])=>(0,u.jsxs)(`label`,{className:`check`,children:[(0,u.jsx)(`input`,{type:`radio`,...e.register(`plan`,{value:t})}),n]},t))]}),(0,u.jsxs)(`fieldset`,{children:[(0,u.jsx)(`legend`,{children:`通知渠道（复选框组）`}),[[`email`,`邮件`],[`sms`,`短信`],[`push`,`推送`]].map(([t,n])=>(0,u.jsxs)(`label`,{className:`check`,children:[(0,u.jsx)(`input`,{type:`checkbox`,...e.register(`channels`,{value:t})}),n]},t))]}),(0,u.jsxs)(`label`,{children:[`服务区域（多选，按住 Ctrl/⌘ 选择多项）`,(0,u.jsxs)(`select`,{multiple:!0,...e.register(`regions`),children:[(0,u.jsx)(`option`,{value:`north`,children:`华北`}),(0,u.jsx)(`option`,{value:`east`,children:`华东`}),(0,u.jsx)(`option`,{value:`south`,children:`华南`})]})]}),(0,u.jsxs)(`label`,{children:[`附件（值为 File[]）`,(0,u.jsx)(`input`,{type:`file`,multiple:!0,...e.register(`attachments`,{type:`file`})})]}),(0,u.jsx)(`pre`,{children:JSON.stringify({...e.values,attachments:e.values.attachments.map(e=>e.name)},null,2)})]})}var x=`import * as React from "react";

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
`;function S(){let e=n({initialValues:{name:``,email:``},mode:`onBlur`,validators:{name:e=>e.trim()?void 0:`请填写姓名`,email:e=>e.includes(`@`)?void 0:`邮箱格式不正确`}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{type:`button`,onClick:()=>e.reset(),children:`清空并重置`}),(0,u.jsxs)(`label`,{children:[`姓名`,(0,u.jsx)(`input`,{...e.register(`name`)})]}),(0,u.jsx)(`small`,{children:e.errors.name??(e.touched.name?`✓`:`未交互`)}),(0,u.jsxs)(`label`,{children:[`邮箱`,(0,u.jsx)(`input`,{...e.register(`email`)})]}),(0,u.jsx)(`small`,{children:e.errors.email??(e.touched.email?`✓`:`未交互`)}),(0,u.jsxs)(`output`,{children:[`当前错误：`,JSON.stringify(e.errors)]})]})}var C=`import * as React from "react";

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
`;function w(){let e=n({initialValues:{username:``,age:16,website:``},criteriaMode:`all`});return(0,u.jsxs)(`form`,{onSubmit:e.handleSubmit(()=>{}),noValidate:!0,children:[(0,u.jsx)(`button`,{type:`submit`,children:`提交并显示全部规则错误`}),(0,u.jsxs)(`label`,{children:[`用户名（必填、3–12 位小写字母或数字）`,(0,u.jsx)(`input`,{...e.register(`username`,{required:`请填写用户名`,minLength:{value:3,message:`至少 3 位`},maxLength:12,pattern:{value:/^[a-z0-9]+$/,message:`只能包含小写字母和数字`}})})]}),(0,u.jsx)(`small`,{...e.getErrorProps(`username`),children:Object.values(e.errorDetails.username?.types??{}).join(`；`)}),(0,u.jsxs)(`label`,{children:[`年龄（不小于 18）`,(0,u.jsx)(`input`,{type:`number`,...e.register(`age`,{valueAsNumber:!0,min:18})})]}),(0,u.jsx)(`small`,{...e.getErrorProps(`age`),children:e.errors.age}),(0,u.jsxs)(`label`,{children:[`个人主页（选填，填写时需以 https:// 开头）`,(0,u.jsx)(`input`,{...e.register(`website`,{validate:e=>!e||e.startsWith(`https://`)||`请使用 https 链接`})})]}),(0,u.jsx)(`small`,{...e.getErrorProps(`website`),children:e.errors.website}),(0,u.jsxs)(`output`,{children:[`用户名输入框 aria-describedby →`,` `,e.errors.username?e.getErrorProps(`username`).id:`（无错误时不关联）`]})]})}var T=`import * as React from "react";

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
`,E=[`admin`,`root`];function D(){let[e,t]=_.useState([]),r=n({initialValues:{username:``,email:``},mode:`onChange`,validateDebounce:200,validators:{username:async(e,n,{signal:r})=>e?(r.addEventListener(`abort`,()=>t(t=>[...t.slice(-4),`已中止对 "${e}" 的查重`])),await s(r,800),t(t=>[...t.slice(-4),`"${e}" 查重完成`]),E.includes(e)?`用户名已被占用`:void 0):`请填写用户名`,email:async(e,t,{signal:n})=>(await s(n,500),e.includes(`@`)?void 0:`邮箱格式不正确`)}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{onClick:()=>r.setFieldValue(`username`,`admin`),children:`填入已占用的用户名 admin`}),(0,u.jsxs)(`label`,{children:[`用户名（试试 admin、root）`,(0,u.jsx)(`input`,{...r.register(`username`)})]}),(0,u.jsx)(`small`,{children:r.validatingFields.username?`查重中…`:r.errors.username??`✓`}),(0,u.jsxs)(`label`,{children:[`邮箱（与用户名同时校验）`,(0,u.jsx)(`input`,{...r.register(`email`)})]}),(0,u.jsx)(`small`,{children:r.validatingFields.email?`校验中…`:r.errors.email??`✓`}),(0,u.jsx)(`output`,{children:e.join(` → `)||`连续输入会中止上一次查重`})]})}var O=`import * as React from "react";

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
          setLog((l) => [...l.slice(-4), \`已中止对 "\${value}" 的查重\`]),
        );
        await delay(signal, 800);
        setLog((l) => [...l.slice(-4), \`"\${value}" 查重完成\`]);
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
`,k=0,A=async e=>(await s(e,600),k++,{nickname:`服务端昵称 v${k}`,bio:`第 ${k} 次加载的简介`});function j(){let e=n({initialValues:{nickname:``,bio:``},loadValues:({signal:e})=>A(e)});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{onClick:e.reloadValues,disabled:e.isLoading,children:`重新加载服务端数据`}),e.isLoading?(0,u.jsx)(`output`,{children:`加载中…`}):(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(`label`,{children:[`昵称`,(0,u.jsx)(`input`,{...e.register(`nickname`)})]}),(0,u.jsxs)(`label`,{children:[`简介`,(0,u.jsx)(`input`,{...e.register(`bio`)})]}),(0,u.jsxs)(`output`,{children:[`isDirty：`,String(e.isDirty),` · 已修改：`,Object.keys(e.dirtyFields).join(`、`)||`无`]})]})]})}var M=`import * as React from "react";

import { useForm } from "../../../src";

import { delay } from "../../demos/webHelpers";

let version = 0;
const fetchProfile = async (signal: AbortSignal) => {
  await delay(signal, 600);
  version++;
  return {
    nickname: \`服务端昵称 v\${version}\`,
    bio: \`第 \${version} 次加载的简介\`,
  };
};

function Feature5() {
  const form = useForm({
    initialValues: { nickname: "", bio: "" },
    loadValues: ({ signal }) => fetchProfile(signal),
  });
  return (
    <>
      <button onClick={form.reloadValues} disabled={form.isLoading}>
        重新加载服务端数据
      </button>
      {form.isLoading ? (
        <output>加载中…</output>
      ) : (
        <>
          <label>
            昵称
            <input {...form.register("nickname")} />
          </label>
          <label>
            简介
            <input {...form.register("bio")} />
          </label>
          <output>
            isDirty：{String(form.isDirty)} · 已修改：
            {Object.keys(form.dirtyFields).join("、") || "无"}
          </output>
        </>
      )}
    </>
  );
}

export default Feature5;
`;function N(){let[e,t]=_.useState({title:`周报 v1`,status:`草稿`}),r=n({initialValues:e,values:e,resetOptions:{keepDirtyValues:!0}});return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{onClick:()=>t(e=>({title:`周报 v${Number(e.title.slice(4))+1}`,status:e.status===`草稿`?`已审核`:`草稿`})),children:`模拟服务端推送新数据`}),(0,u.jsxs)(`label`,{children:[`标题（先修改它，再推送新数据）`,(0,u.jsx)(`input`,{...r.register(`title`)})]}),(0,u.jsxs)(`label`,{children:[`状态`,(0,u.jsx)(`input`,{...r.register(`status`)})]}),(0,u.jsxs)(`output`,{children:[`服务端：`,e.title,` / `,e.status,` · 本地已修改：`,Object.keys(r.dirtyFields).join(`、`)||`无`]})]})}var P=`import * as React from "react";

import { useForm } from "../../../src";

function Feature6() {
  const [server, setServer] = React.useState({
    title: "周报 v1",
    status: "草稿",
  });
  const form = useForm({
    initialValues: server,
    values: server,
    resetOptions: { keepDirtyValues: true },
  });
  return (
    <>
      <button
        onClick={() =>
          setServer((s) => ({
            title: \`周报 v\${Number(s.title.slice(4)) + 1}\`,
            status: s.status === "草稿" ? "已审核" : "草稿",
          }))
        }
      >
        模拟服务端推送新数据
      </button>
      <label>
        标题（先修改它，再推送新数据）
        <input {...form.register("title")} />
      </label>
      <label>
        状态
        <input {...form.register("status")} />
      </label>
      <output>
        服务端：{server.title} / {server.status} · 本地已修改：
        {Object.keys(form.dirtyFields).join("、") || "无"}
      </output>
    </>
  );
}

export default Feature6;
`;function F(){let[e,t]=_.useState(`尚未提交`),r=n({initialValues:{email:``,tags:``},validators:{email:e=>e.includes(`@`)?void 0:`邮箱格式不正确`}}),i=r.handleSubmit(async e=>{if(await s(new AbortController().signal,300),e.email===`taken@example.com`)throw r.setErrors({email:`该邮箱已注册（服务端返回）`}),Error(`服务端拒绝`);t(`提交成功：${JSON.stringify(e)}`)},{onInvalid:e=>t(`校验失败：${Object.keys(e).join(`、`)}`),transform:e=>({email:e.email.trim().toLowerCase(),tags:e.tags.split(`,`).map(e=>e.trim()).filter(Boolean)})});return(0,u.jsxs)(`form`,{onSubmit:i,noValidate:!0,children:[(0,u.jsx)(`button`,{type:`submit`,disabled:r.isSubmitting,children:r.isSubmitting?`提交中…`:`提交`}),(0,u.jsxs)(`label`,{children:[`邮箱（输入 taken@example.com 模拟服务端错误）`,(0,u.jsx)(`input`,{...r.register(`email`)})]}),(0,u.jsx)(`small`,{children:r.errors.email}),(0,u.jsxs)(`label`,{children:[`标签（逗号分隔，提交前转换为数组）`,(0,u.jsx)(`input`,{...r.register(`tags`)})]}),(0,u.jsxs)(`output`,{children:[`submitCount：`,r.submitCount,` · isSubmitSuccessful：`,String(r.isSubmitSuccessful)]}),(0,u.jsx)(`p`,{children:e})]})}var I=`import * as React from "react";

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
      setLog(\`提交成功：\${JSON.stringify(payload)}\`);
    },
    {
      onInvalid: (errors) =>
        setLog(\`校验失败：\${Object.keys(errors).join("、")}\`),
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
`;function L(){let e=n({initialValues:{title:``,content:``,password:``},persist:{key:`demo-form-draft`,debounce:300,exclude:[`password`]}});return(0,u.jsxs)(`form`,{onSubmit:e.handleSubmit(()=>{}),children:[(0,u.jsxs)(`label`,{children:[`标题`,(0,u.jsx)(`input`,{...e.register(`title`)})]}),(0,u.jsxs)(`label`,{children:[`正文`,(0,u.jsx)(`textarea`,{...e.register(`content`)})]}),(0,u.jsxs)(`label`,{children:[`发布密码（exclude，不会保存）`,(0,u.jsx)(`input`,{type:`password`,...e.register(`password`)})]}),(0,u.jsx)(`button`,{type:`submit`,children:`发布（成功后清除草稿）`}),(0,u.jsxs)(`output`,{children:[`已修改：`,Object.keys(e.dirtyFields).join(`、`)||`无`]})]})}function R(){let[e,t]=_.useState(!0);return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`关闭编辑器（模拟离开页面）`:`重新打开编辑器`}),e?(0,u.jsx)(L,{}):(0,u.jsx)(`p`,{children:`编辑器已关闭；重新打开会恢复草稿（密码除外）。`}),(0,u.jsx)(`button`,{className:`secondary`,onClick:()=>localStorage.removeItem(`demo-form-draft`),children:`清除已保存的草稿`})]})}var z=`import * as React from "react";

import { useForm } from "../../../src";

function Editor() {
  const form = useForm({
    initialValues: { title: "", content: "", password: "" },
    persist: { key: "demo-form-draft", debounce: 300, exclude: ["password"] },
  });
  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <label>
        标题
        <input {...form.register("title")} />
      </label>
      <label>
        正文
        <textarea {...form.register("content")} />
      </label>
      <label>
        发布密码（exclude，不会保存）
        <input type="password" {...form.register("password")} />
      </label>
      <button type="submit">发布（成功后清除草稿）</button>
      <output>
        已修改：{Object.keys(form.dirtyFields).join("、") || "无"}
      </output>
    </form>
  );
}

function Feature8() {
  const [mounted, setMounted] = React.useState(true);
  return (
    <>
      <button onClick={() => setMounted((v) => !v)}>
        {mounted ? "关闭编辑器（模拟离开页面）" : "重新打开编辑器"}
      </button>
      {mounted ? (
        <Editor />
      ) : (
        <p>编辑器已关闭；重新打开会恢复草稿（密码除外）。</p>
      )}
      <button
        className="secondary"
        onClick={() => localStorage.removeItem("demo-form-draft")}
      >
        清除已保存的草稿
      </button>
    </>
  );
}

export default Feature8;
`,B={"~standard":{version:1,vendor:`demo`,validate:e=>{let t=e,n=[];return t.email.includes(`@`)||n.push({message:`邮箱格式不正确`,path:[`email`]}),t.password.length<8&&n.push({message:`密码至少 8 位`,path:[`password`]}),t.confirm!==t.password&&n.push({message:`两次密码不一致`,path:[`confirm`]}),n.length?{issues:n}:{value:t}}}};function V(){let e=n({initialValues:{email:``,password:``,confirm:``},mode:`onBlur`,schema:l(B)});return(0,u.jsxs)(`form`,{onSubmit:e.handleSubmit(()=>{}),noValidate:!0,children:[(0,u.jsx)(`button`,{type:`submit`,children:`提交整表校验`}),[`email`,`password`,`confirm`].map(t=>(0,u.jsxs)(_.Fragment,{children:[(0,u.jsxs)(`label`,{children:[{email:`邮箱`,password:`密码`,confirm:`确认密码`}[t],(0,u.jsx)(`input`,{type:t===`email`?`email`:`password`,...e.register(t)})]}),(0,u.jsx)(`small`,{children:e.errors[t]})]},t)),(0,u.jsxs)(`output`,{children:[`失焦只采纳当前字段的 schema 错误：`,JSON.stringify(e.errors)]})]})}var H=`import * as React from "react";

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
`,U=_.memo(function({control:e,name:t,label:n}){let i=r(e,t),a=_.useRef(0);return a.current++,(0,u.jsxs)(`label`,{children:[n,`（渲染 `,a.current,` 次`,i.dirty?`，已修改`:``,`）`,(0,u.jsx)(`input`,{value:i.value,onChange:e=>i.setValue(e.target.value)})]})}),W=_.memo(function({control:e}){let n=t(e,`first`),r=t(e,`last`);return(0,u.jsxs)(`output`,{children:[`预览：`,`${r}${n}`||`（空）`]})});function G(){let e=n({initialValues:{first:``,last:``}}),t=_.useRef(0);return t.current++,(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(`button`,{onClick:()=>e.setFieldValue(`last`,`王`,{shouldDirty:!1}),children:`程序化填入姓氏（shouldDirty: false）`}),(0,u.jsx)(U,{control:e.control,name:`first`,label:`名`}),(0,u.jsx)(U,{control:e.control,name:`last`,label:`姓`}),(0,u.jsx)(W,{control:e.control}),(0,u.jsxs)(`small`,{children:[`表单根组件渲染 `,t.current,` 次。根组件没有读取 values，修改任一字段只会重渲染对应输入框和预览。`]})]})}var K=`import * as React from "react";

import {
  useForm,
  useFormField,
  useWatch,
  type FormControl,
} from "../../../src";

type Profile = { first: string; last: string };

const NameInput = React.memo(function NameInput({
  control,
  name,
  label,
}: {
  control: FormControl<Profile>;
  name: keyof Profile;
  label: string;
}) {
  const field = useFormField(control, name);
  const renders = React.useRef(0);
  renders.current++;
  return (
    <label>
      {label}（渲染 {renders.current} 次{field.dirty ? "，已修改" : ""}）
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const FullName = React.memo(function FullName({
  control,
}: {
  control: FormControl<Profile>;
}) {
  const first = useWatch(control, "first");
  const last = useWatch(control, "last");
  return <output>预览：{\`\${last}\${first}\` || "（空）"}</output>;
});

function Feature10() {
  const form = useForm<Profile>({ initialValues: { first: "", last: "" } });
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <button
        onClick={() => form.setFieldValue("last", "王", { shouldDirty: false })}
      >
        程序化填入姓氏（shouldDirty: false）
      </button>
      <NameInput control={form.control} name="first" label="名" />
      <NameInput control={form.control} name="last" label="姓" />
      <FullName control={form.control} />
      <small>
        表单根组件渲染 {renders.current} 次。根组件没有读取
        values，修改任一字段只会重渲染对应输入框和预览。
      </small>
    </>
  );
}

export default Feature10;
`;function q(){return(0,u.jsxs)(`div`,{className:`additional-demos`,children:[(0,u.jsx)(e,{source:f,title:`嵌套字段与局部校验`,description:`通过点号路径注册嵌套值，只校验指定字段，并显示 touched 与错误。`,children:(0,u.jsx)(d,{})}),(0,u.jsx)(e,{source:m,title:`提交失败与服务端字段错误`,description:`模拟提交失败后展示 submitError，也可把业务错误绑定到字段；重置会清理状态。`,children:(0,u.jsx)(p,{})}),(0,u.jsx)(e,{source:g,title:`单字段重置与错误聚焦`,description:`提交空值时自动聚焦首个错误字段；只重置姓名，不影响另一字段的编辑。`,children:(0,u.jsx)(h,{})}),(0,u.jsx)(e,{source:y,title:`条件字段卸载策略`,description:`勾选移除策略后，隐藏字段会注销其值与校验；默认隐藏后仍保留。`,children:(0,u.jsx)(v,{})}),(0,u.jsx)(e,{source:x,title:`单选组、复选框组、多选与文件`,description:`register 传入 value 绑定 radio 与复选框组，数组字段配合 select multiple，type: 'file' 时值为 File[]。`,children:(0,u.jsx)(b,{})}),(0,u.jsx)(e,{source:C,title:`失焦只校验当前字段`,description:`onBlur 模式下离开姓名只显示姓名错误，未交互的邮箱不会提前报错。`,children:(0,u.jsx)(S,{})}),(0,u.jsx)(e,{source:T,title:`声明式规则与无障碍错误`,description:`register 直接声明 required、长度、pattern、min 与自定义 validate；criteriaMode: 'all' 列出全部失败规则，错误通过 aria-describedby 关联到输入框。`,children:(0,u.jsx)(w,{})}),(0,u.jsx)(e,{source:O,title:`异步查重的中止与字段级 loading`,description:`连续输入会通过 signal 中止上一次查重；validatingFields 为每个字段单独显示校验中，两个字段可以同时校验。`,children:(0,u.jsx)(D,{})}),(0,u.jsx)(e,{source:M,title:`异步加载编辑数据`,description:`loadValues 加载服务端数据作为基准，加载期间显示 isLoading；修改后 dirtyFields 精确列出改动字段，可重新加载。`,children:(0,u.jsx)(j,{})}),(0,u.jsx)(e,{source:P,title:`外部数据刷新保留用户修改`,description:`values 变化时自动同步，keepDirtyValues 保留用户已改的字段，其余字段更新为服务端新值。`,children:(0,u.jsx)(N,{})}),(0,u.jsx)(e,{source:I,title:`提交转换、失败回调与服务端错误`,description:`transform 在提交前整理数据，onInvalid 接收校验失败；服务端拒绝时用 setErrors 回填字段错误，并显示 submitCount 与 isSubmitSuccessful。`,children:(0,u.jsx)(F,{})}),(0,u.jsx)(e,{source:z,title:`草稿自动保存与恢复`,description:`persist 防抖保存到 localStorage，关闭后重新打开会恢复草稿；密码字段被 exclude，发布成功后自动清除草稿。`,children:(0,u.jsx)(R,{})}),(0,u.jsx)(e,{source:H,title:`Standard Schema 适配`,description:`standardSchema 接入 Zod、Valibot、ArkType 等实现 Standard Schema 的校验库；失焦时只采纳当前字段的错误。`,children:(0,u.jsx)(V,{})}),(0,u.jsx)(e,{source:K,title:`按字段渲染与程序化赋值`,description:`字段通过 useFormField、预览通过 useWatch 订阅，修改字段时表单根组件不重渲染；shouldDirty: false 赋值后字段仍视为未修改。`,children:(0,u.jsx)(G,{})})]})}export{q as default};