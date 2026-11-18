import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./interaction-CiM6OlIl.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState({profile:{name:`小林`}}),n=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`资料姓名`,(0,o.jsx)(`input`,{value:e.profile.name,onChange:e=>t({profile:{name:e.target.value}})})]}),(0,o.jsx)(`button`,{onClick:()=>t({profile:{name:`小林`}}),children:`恢复原始内容`}),(0,o.jsx)(`button`,{onClick:()=>n.reset(),children:`保存资料基准`}),(0,o.jsx)(`output`,{children:n.isDirty?`资料已修改`:`资料未修改`})]})}var c=`import * as React from "react";

import { useDirty } from "../../../src";

function Case1() {
  const [value, setValue] = React.useState({ profile: { name: "小林" } });
  const dirty = useDirty(value);
  return (
    <>
      <label>
        资料姓名
        <input
          value={value.profile.name}
          onChange={(e) => setValue({ profile: { name: e.target.value } })}
        />
      </label>
      <button onClick={() => setValue({ profile: { name: "小林" } })}>
        恢复原始内容
      </button>
      <button onClick={() => dirty.reset()}>保存资料基准</button>
      <output>{dirty.isDirty ? "资料已修改" : "资料未修改"}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`Hello`),n=r(e,{isEqual:(e,t)=>e.trim().toLowerCase()===t.trim().toLowerCase()});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`忽略空白的标题`,(0,o.jsx)(`input`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsx)(`button`,{onClick:()=>t(` HELLO `),children:`仅改变格式`}),(0,o.jsx)(`button`,{onClick:()=>t(`New title`),children:`改变内容`}),(0,o.jsx)(`output`,{children:n.isDirty?`内容变化`:`内容相同`})]})}var u=`import * as React from "react";

import { useDirty } from "../../../src";

function Case2() {
  const [value, setValue] = React.useState("Hello");
  const dirty = useDirty(value, {
    isEqual: (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase(),
  });
  return (
    <>
      <label>
        忽略空白的标题
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={() => setValue(" HELLO ")}>仅改变格式</button>
      <button onClick={() => setValue("New title")}>改变内容</button>
      <output>{dirty.isDirty ? "内容变化" : "内容相同"}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`嵌套表单快照`,description:`默认深比较对象内容；恢复原始字段后会重新变为未修改状态。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`自定义比较规则`,description:`忽略首尾空格与大小写，只在有意义的内容变化时提示。`,children:(0,o.jsx)(l,{})})]})}export{d as default};