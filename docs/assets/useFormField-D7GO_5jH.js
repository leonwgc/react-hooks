import{t as e}from"./Scenario-qCntdwnE.js";import{n as t,r as n}from"./form-BehJX3LY.js";import{D as r}from"./index--S_n-0Gu.js";var i=r();function a(){let e=t({initialValues:{quantity:1},mode:`onBlur`,validators:{quantity:e=>e<1?`数量至少为 1`:void 0}}),r=n(e.control,`quantity`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(`label`,{children:[`订阅数量`,(0,i.jsx)(`input`,{type:`number`,value:r.value,onChange:e=>r.setValue(Number(e.target.value)),onBlur:r.onBlur})]}),(0,i.jsx)(`button`,{onClick:()=>r.setValue(0),children:`设置无效数量`}),(0,i.jsx)(`button`,{onClick:r.onBlur,children:`触碰并校验数量`}),(0,i.jsxs)(`output`,{children:[`touched `,String(r.touched),` · `,r.error??`无错误`]})]})}var o=`import { useFormField, useForm } from "../../../src";

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

export default Case1;
`;function s(){let e=t({initialValues:{settings:{nickname:`访客`}}}),r=n(e.control,`settings.nickname`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(`label`,{children:[`订阅昵称`,(0,i.jsx)(`input`,{value:r.value,onChange:e=>r.setValue(e.target.value),onBlur:r.onBlur})]}),(0,i.jsx)(`button`,{onClick:()=>e.setFieldValue(`settings.nickname`,`管理员`),children:`父表单写入昵称`}),(0,i.jsx)(`button`,{onClick:()=>e.reset(),children:`父表单重置`}),(0,i.jsxs)(`output`,{children:[`订阅值 `,r.value,` · 已触碰 `,String(r.touched)]})]})}var c=`import { useFormField, useForm } from "../../../src";

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

export default Case2;
`;function l(){return(0,i.jsxs)(`div`,{className:`additional-demos`,children:[(0,i.jsx)(e,{source:o,title:`自定义数值字段`,description:`直接使用 setValue 接入数字控件，失焦时触发该字段校验。`,children:(0,i.jsx)(a,{})}),(0,i.jsx)(e,{source:c,title:`嵌套路径与外部重置`,description:`订阅嵌套字段，父表单直接写入或重置后订阅者同步更新。`,children:(0,i.jsx)(s,{})})]})}export{l as default};