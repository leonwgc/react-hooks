import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r,t as i}from"./interaction-a07diKrt.js";import{D as a}from"./index-C6jdXK2z.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(!0),[n,a]=o.useState(`尚未接收`),c=i(`待投放内容`),l=r(({text:e})=>a(e),{disabled:e});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`启用接收`:`停用接收`}),(0,s.jsx)(`div`,{...c.bind,children:`拖动待投放内容`}),(0,s.jsx)(`div`,{...l.bind,className:`notice`,children:e?`接收已关闭`:l.over?`松开投放`:n}),(0,s.jsx)(`button`,{disabled:e,onClick:()=>a(`待投放内容`),children:`键盘投放内容`})]})}var l=`import * as React from "react";

import { useDrop, useDrag } from "../../../src";

function Case1() {
  const [disabled, setDisabled] = React.useState(true);
  const [result, setResult] = React.useState("尚未接收");
  const drag = useDrag("待投放内容");
  const drop = useDrop(({ text }) => setResult(text), { disabled });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用接收" : "停用接收"}
      </button>
      <div {...drag.bind}>拖动待投放内容</div>
      <div {...drop.bind} className="notice">
        {disabled ? "接收已关闭" : drop.over ? "松开投放" : result}
      </div>
      <button disabled={disabled} onClick={() => setResult("待投放内容")}>
        键盘投放内容
      </button>
    </>
  );
}

export default Case1;
`;function u(){let[e,t]=o.useState(`未选择`),n=e=>t(e.map(e=>`${e.name} · ${e.size} 字节 · ${e.type||`未知类型`} · ${e.size<=1048576?`接受`:`超过 1MB`}`).join(`；`)),i=r(({files:e})=>n(e));return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`div`,{...i.bind,className:`notice`,children:[i.over?`松开以检查文件`:`拖入文件检查元信息`,(0,s.jsxs)(`label`,{children:[`选择待检查文件`,(0,s.jsx)(`input`,{type:`file`,multiple:!0,onChange:e=>n(Array.from(e.target.files??[]))})]})]}),(0,s.jsx)(`output`,{children:e})]})}var d=`import * as React from "react";

import { useDrop } from "../../../src";

function Case2() {
  const [result, setResult] = React.useState("未选择");
  const accept = (files: File[]) =>
    setResult(
      files
        .map(
          (f) =>
            \`\${f.name} · \${f.size} 字节 · \${f.type || "未知类型"} · \${f.size <= 1024 * 1024 ? "接受" : "超过 1MB"}\`,
        )
        .join("；"),
    );
  const drop = useDrop(({ files }) => accept(files));
  return (
    <>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开以检查文件" : "拖入文件检查元信息"}
        <label>
          选择待检查文件
          <input
            type="file"
            multiple
            onChange={(e) => accept(Array.from(e.target.files ?? []))}
          />
        </label>
      </div>
      <output>{result}</output>
    </>
  );
}

export default Case2;
`;function f(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`禁用接收区域`,description:`禁用后不接受拖放；启用后拖入文字或使用按钮完成同一业务动作。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`文件元信息与业务校验`,description:`接收到文件后展示名称、大小和类型；此示例只接受小于 1MB 的文件，不上传。`,children:(0,s.jsx)(u,{})})]})}export{f as default};