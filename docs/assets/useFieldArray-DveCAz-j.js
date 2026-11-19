import{t as e}from"./Scenario-qCntdwnE.js";import{n as t,t as n}from"./form-BehJX3LY.js";import{D as r}from"./index--S_n-0Gu.js";var i=r();function a(){let e=t({initialValues:{tags:[`React`]}}),r=n(e,`tags`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`div`,{children:r.fields.map((t,n)=>(0,i.jsxs)(`div`,{className:`demo-row`,children:[(0,i.jsxs)(`label`,{children:[`标签 `,n+1,(0,i.jsx)(`input`,{...e.register(`tags.${n}`)})]}),(0,i.jsxs)(`button`,{onClick:()=>r.remove(n),children:[`删除标签 `,n+1]})]},t.id))}),(0,i.jsx)(`button`,{onClick:()=>r.append(`新标签`),children:`追加标签`}),(0,i.jsx)(`output`,{children:JSON.stringify(e.values.tags)})]})}var o=`import { useFieldArray, useForm } from "../../../src";

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
`;function s(){let e=t({initialValues:{rows:[{title:`甲`},{title:`乙`}]}}),r=n(e,`rows`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{onClick:()=>r.move(0,1),children:`交换两行位置`}),(0,i.jsx)(`button`,{onClick:()=>r.replace([{title:`导入丙`},{title:`导入丁`}]),children:`批量导入两行`}),(0,i.jsx)(`button`,{onClick:()=>e.reset(),children:`恢复初始数组`}),(0,i.jsx)(`ul`,{children:r.fields.map(e=>(0,i.jsxs)(`li`,{children:[e.value.title,` · ID `,e.id]},e.id))})]})}var c=`import { useFieldArray, useForm } from "../../../src";

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
`;function l(){let e=t({initialValues:{rows:[{name:`甲`},{name:`乙`}]}}),r=n(e,`rows`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{onClick:()=>{e.setFieldError(`rows.0.name`,`需要修订`),e.setFieldTouched(`rows.0.name`)},children:`标记第一行错误`}),(0,i.jsx)(`button`,{onClick:()=>r.swap(0,1),children:`交换前两行`}),(0,i.jsx)(`button`,{onClick:()=>r.insert(1,{name:`新行`}),children:`中间插入一行`}),(0,i.jsx)(`ul`,{children:r.fields.map((t,n)=>(0,i.jsxs)(`li`,{children:[t.value.name,` · `,t.id,` ·`,` `,e.errors[`rows.${n}.name`]??`无错误`,` · touched`,` `,String(!!e.touched[`rows.${n}.name`])]},t.id))})]})}var u=`import { useFieldArray, useForm } from "../../../src";

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
`;function d(){let e=t({initialValues:{rows:[{name:`原始行`}]}}),r=n(e,`rows`);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{onClick:()=>r.update(0,{name:`已更新`}),children:`更新首行内容`}),(0,i.jsx)(`button`,{onClick:()=>r.prepend({name:`头部新增`}),children:`头部新增一行`}),(0,i.jsx)(`button`,{onClick:()=>e.resetField(`rows`),children:`重置数组字段`}),(0,i.jsx)(`ul`,{children:r.fields.map(e=>(0,i.jsxs)(`li`,{children:[e.value.name,` · `,e.id]},e.id))})]})}var f=`import { useFieldArray, useForm } from "../../../src";

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
`;function p(){return(0,i.jsxs)(`div`,{className:`additional-demos`,children:[(0,i.jsx)(e,{source:o,title:`基本类型数组`,description:`数组项也可以是字符串，添加后通过字段路径编辑，删除后剩余项路径自动对应。`,children:(0,i.jsx)(a,{})}),(0,i.jsx)(e,{source:c,title:`批量替换与稳定标识`,description:`移动保留行 ID，replace 为新数据生成新 ID；表单 reset 恢复初始数组。`,children:(0,i.jsx)(s,{})}),(0,i.jsx)(e,{source:u,title:`插入交换与元数据跟随`,description:`给第一行标记错误后交换行，错误与 touched 随原记录移动；插入的新行有独立 ID。`,children:(0,i.jsx)(l,{})}),(0,i.jsx)(e,{source:f,title:`更新保留身份与数组重置`,description:`更新一行保留 ID，头部插入不改变旧行身份；重置数组则为全部行重新生成 ID。`,children:(0,i.jsx)(d,{})})]})}export{p as default};