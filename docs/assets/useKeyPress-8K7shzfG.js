import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,s as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let e=a.useRef(null),[t,n]=a.useState(!0),[r,s]=a.useState(0);return i(`enter`,()=>s(e=>e+1),{scope:e,enabled:t}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e=>!e),children:t?`暂停快捷键`:`启用快捷键`}),(0,o.jsx)(`div`,{ref:e,children:(0,o.jsx)(`button`,{children:`聚焦这里后按 Enter`})}),(0,o.jsxs)(`output`,{children:[`局部命令 `,r,` 次`]})]})}var c=`import * as React from "react";

import { useKeyPress } from "../../../src";

function Case1() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useKeyPress("enter", () => setCount((n) => n + 1), { scope, enabled });
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停快捷键" : "启用快捷键"}
      </button>
      <div ref={scope}>
        <button>聚焦这里后按 Enter</button>
      </div>
      <output>局部命令 {count} 次</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),[t,n]=a.useState(`等待快捷键`);return i([`alt+j`,`alt+l`],e=>n(e.key),{scope:e,allowInInput:!0,preventDefault:!0,repeat:!1}),(0,o.jsxs)(`div`,{ref:e,children:[(0,o.jsxs)(`label`,{children:[`命令输入区`,(0,o.jsx)(`input`,{placeholder:`按 Alt+J 或 Alt+L`})]}),(0,o.jsxs)(`output`,{children:[`最近命令：`,t]})]})}var u=`import * as React from "react";

import { useKeyPress } from "../../../src";

function Case2() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [key, setKey] = React.useState("等待快捷键");
  useKeyPress(["alt+j", "alt+l"], (e) => setKey(e.key), {
    scope,
    allowInInput: true,
    preventDefault: true,
    repeat: false,
  });
  return (
    <div ref={scope}>
      <label>
        命令输入区
        <input placeholder="按 Alt+J 或 Alt+L" />
      </label>
      <output>最近命令：{key}</output>
    </div>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`动态启用局部快捷键`,description:`聚焦区域按钮后按 Enter；暂停绑定时不触发。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`输入框中的多组合键`,description:`允许在输入框内使用 Alt+J / Alt+L，禁止默认动作并忽略长按重复。`,children:(0,o.jsx)(l,{})})]})}export{d as default};