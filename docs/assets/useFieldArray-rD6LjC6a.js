import{t as e}from"./Scenario-lI9aBaLE.js";import{n as t,t as n}from"./form-BPPkl8Rn.js";import{D as r}from"./index-BH-UjxLV.js";import{t as i}from"./react-DvXU6kJ2.js";var a=r();function o(){let e=t({initialValues:{tags:[`React`]}}),r=n(e,`tags`);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`div`,{children:r.fields.map((t,n)=>(0,a.jsxs)(`div`,{className:`demo-row`,children:[(0,a.jsxs)(`label`,{children:[`标签 `,n+1,(0,a.jsx)(`input`,{...e.register(`tags.${n}`)})]}),(0,a.jsxs)(`button`,{onClick:()=>r.remove(n),children:[`删除标签 `,n+1]})]},t.id))}),(0,a.jsx)(`button`,{onClick:()=>r.append(`新标签`),children:`追加标签`}),(0,a.jsx)(`output`,{children:JSON.stringify(e.values.tags)})]})}var s=`import { useFieldArray, useForm } from "../../../src";

function Case1() {
  const f = useForm({ initialValues: { tags: ["React"] } });
  const a = useFieldArray(f, "tags");
  return (
    <>
      <div>
        {a.fields.map((field, i) => (
          <div className="demo-row" key={field.id}>
            <label>
              标签 {i + 1}
              <input {...f.register(\`tags.\${i}\`)} />
            </label>
            <button onClick={() => a.remove(i)}>删除标签 {i + 1}</button>
          </div>
        ))}
      </div>
      <button onClick={() => a.append("新标签")}>追加标签</button>
      <output>{JSON.stringify(f.values.tags)}</output>
    </>
  );
}

export default Case1;
`;function c(){let e=t({initialValues:{rows:[{title:`甲`},{title:`乙`}]}}),r=n(e,`rows`);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>r.move(0,1),children:`交换两行位置`}),(0,a.jsx)(`button`,{onClick:()=>r.replace([{title:`导入丙`},{title:`导入丁`}]),children:`批量导入两行`}),(0,a.jsx)(`button`,{onClick:()=>e.reset(),children:`恢复初始数组`}),(0,a.jsx)(`ul`,{children:r.fields.map(e=>(0,a.jsxs)(`li`,{children:[e.value.title,` · ID `,e.id]},e.id))})]})}var l=`import { useFieldArray, useForm } from "../../../src";

function Case2() {
  const f = useForm({
    initialValues: { rows: [{ title: "甲" }, { title: "乙" }] },
  });
  const a = useFieldArray(f, "rows");
  return (
    <>
      <button onClick={() => a.move(0, 1)}>交换两行位置</button>
      <button
        onClick={() => a.replace([{ title: "导入丙" }, { title: "导入丁" }])}
      >
        批量导入两行
      </button>
      <button onClick={() => f.reset()}>恢复初始数组</button>
      <ul>
        {a.fields.map((field) => (
          <li key={field.id}>
            {field.value.title} · ID {field.id}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
`;function u(){let e=t({initialValues:{rows:[{name:`甲`},{name:`乙`}]}}),r=n(e,`rows`);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>{e.setFieldError(`rows.0.name`,`需要修订`),e.setFieldTouched(`rows.0.name`)},children:`标记第一行错误`}),(0,a.jsx)(`button`,{onClick:()=>r.swap(0,1),children:`交换前两行`}),(0,a.jsx)(`button`,{onClick:()=>r.insert(1,{name:`新行`}),children:`中间插入一行`}),(0,a.jsx)(`ul`,{children:r.fields.map((t,n)=>(0,a.jsxs)(`li`,{children:[t.value.name,` · `,t.id,` ·`,` `,e.errors[`rows.${n}.name`]??`无错误`,` · touched`,` `,String(!!e.touched[`rows.${n}.name`])]},t.id))})]})}var d=`import { useFieldArray, useForm } from "../../../src";

function Enhanced1() {
  const f = useForm({
      initialValues: { rows: [{ name: "甲" }, { name: "乙" }] },
    }),
    a = useFieldArray(f, "rows");
  return (
    <>
      <button
        onClick={() => {
          f.setFieldError("rows.0.name", "需要修订");
          f.setFieldTouched("rows.0.name");
        }}
      >
        标记第一行错误
      </button>
      <button onClick={() => a.swap(0, 1)}>交换前两行</button>
      <button onClick={() => a.insert(1, { name: "新行" })}>
        中间插入一行
      </button>
      <ul>
        {a.fields.map((row, index) => (
          <li key={row.id}>
            {row.value.name} · {row.id} ·{" "}
            {f.errors[\`rows.\${index}.name\`] ?? "无错误"} · touched{" "}
            {String(!!f.touched[\`rows.\${index}.name\`])}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced1;
`;function f(){let e=t({initialValues:{rows:[{name:`原始行`}]}}),r=n(e,`rows`);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>r.update(0,{name:`已更新`}),children:`更新首行内容`}),(0,a.jsx)(`button`,{onClick:()=>r.prepend({name:`头部新增`}),children:`头部新增一行`}),(0,a.jsx)(`button`,{onClick:()=>e.resetField(`rows`),children:`重置数组字段`}),(0,a.jsx)(`ul`,{children:r.fields.map(e=>(0,a.jsxs)(`li`,{children:[e.value.name,` · `,e.id]},e.id))})]})}var p=`import { useFieldArray, useForm } from "../../../src";

function Enhanced2() {
  const f = useForm({ initialValues: { rows: [{ name: "原始行" }] } }),
    a = useFieldArray(f, "rows");
  return (
    <>
      <button onClick={() => a.update(0, { name: "已更新" })}>
        更新首行内容
      </button>
      <button onClick={() => a.prepend({ name: "头部新增" })}>
        头部新增一行
      </button>
      <button onClick={() => f.resetField("rows")}>重置数组字段</button>
      <ul>
        {a.fields.map((row) => (
          <li key={row.id}>
            {row.value.name} · {row.id}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced2;
`;i();var m=3;function h(){let e=t({initialValues:{members:[{id:`m1`,name:`Ada`,email:`ada@example.com`},{id:`m2`,name:``,email:``}]},validators:{"members.*.name":e=>e?void 0:`请填写姓名`,"members.*.email":e=>typeof e==`string`&&e.includes(`@`)?void 0:`邮箱格式不正确`}}),r=n(e,`members`,{getKey:e=>e.id,rules:{minLength:{value:2,message:`至少保留 2 名成员`},maxLength:{value:4,message:`最多 4 名成员`}}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>void e.validate(),children:`校验全部成员`}),(0,a.jsx)(`button`,{className:`secondary`,onClick:()=>r.append({id:`m${m++}`,name:``,email:``}),children:`添加成员`}),(0,a.jsx)(`button`,{className:`secondary`,onClick:()=>e.setValues(e=>({members:[...e.members].reverse()})),children:`外部 setValues 反转顺序（key 仍跟随记录）`}),(0,a.jsx)(`small`,{children:e.errors.members}),r.fields.map((t,n)=>(0,a.jsxs)(`fieldset`,{children:[(0,a.jsxs)(`legend`,{children:[`#`,n+1,` · key `,t.id]}),(0,a.jsxs)(`label`,{children:[`姓名`,(0,a.jsx)(`input`,{...e.register(`members.${n}.name`)})]}),(0,a.jsx)(`small`,{children:e.errors[`members.${n}.name`]}),(0,a.jsxs)(`label`,{children:[`邮箱`,(0,a.jsx)(`input`,{...e.register(`members.${n}.email`)})]}),(0,a.jsx)(`small`,{children:e.errors[`members.${n}.email`]}),(0,a.jsx)(`button`,{className:`secondary`,onClick:()=>r.remove(n),children:`删除`})]},t.id))]})}var g=`import * as React from "react";

import { useFieldArray, useForm } from "../../../src";

type Member = { id: string; name: string; email: string };
let next = 3;

function Feature1() {
  const form = useForm<{ members: Member[] }>({
    initialValues: {
      members: [
        { id: "m1", name: "Ada", email: "ada@example.com" },
        { id: "m2", name: "", email: "" },
      ],
    },
    validators: {
      "members.*.name": (value) => (value ? undefined : "请填写姓名"),
      "members.*.email": (value) =>
        typeof value === "string" && value.includes("@")
          ? undefined
          : "邮箱格式不正确",
    },
  });
  const members = useFieldArray(form, "members", {
    getKey: (member) => member.id,
    rules: {
      minLength: { value: 2, message: "至少保留 2 名成员" },
      maxLength: { value: 4, message: "最多 4 名成员" },
    },
  });
  return (
    <>
      <button onClick={() => void form.validate()}>校验全部成员</button>
      <button
        className="secondary"
        onClick={() =>
          members.append({ id: \`m\${next++}\`, name: "", email: "" })
        }
      >
        添加成员
      </button>
      <button
        className="secondary"
        onClick={() =>
          form.setValues((v) => ({ members: [...v.members].reverse() }))
        }
      >
        外部 setValues 反转顺序（key 仍跟随记录）
      </button>
      <small>{form.errors.members}</small>
      {members.fields.map((field, index) => (
        <fieldset key={field.id}>
          <legend>
            #{index + 1} · key {field.id}
          </legend>
          <label>
            姓名
            <input {...form.register(\`members.\${index}.name\`)} />
          </label>
          <small>{form.errors[\`members.\${index}.name\`]}</small>
          <label>
            邮箱
            <input {...form.register(\`members.\${index}.email\`)} />
          </label>
          <small>{form.errors[\`members.\${index}.email\`]}</small>
          <button className="secondary" onClick={() => members.remove(index)}>
            删除
          </button>
        </fieldset>
      ))}
    </>
  );
}

export default Feature1;
`;function _(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`基本类型数组`,description:`数组项也可以是字符串，添加后通过字段路径编辑，删除后剩余项路径自动对应。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:l,title:`批量替换与稳定标识`,description:`移动保留行 ID，replace 为新数据生成新 ID；表单 reset 恢复初始数组。`,children:(0,a.jsx)(c,{})}),(0,a.jsx)(e,{source:d,title:`插入交换与元数据跟随`,description:`给第一行标记错误后交换行，错误与 touched 随原记录移动；插入的新行有独立 ID。`,children:(0,a.jsx)(u,{})}),(0,a.jsx)(e,{source:p,title:`更新保留身份与数组重置`,description:`更新一行保留 ID，头部插入不改变旧行身份；重置数组则为全部行重新生成 ID。`,children:(0,a.jsx)(f,{})}),(0,a.jsx)(e,{source:g,title:`通配校验、数组规则与记录 key`,description:`validators 使用 members.*.name 通配路径校验每一行，rules 限制成员数量；getKey 让外部 setValues 重排后 key 仍跟随记录。`,children:(0,a.jsx)(h,{})})]})}export{_ as default};