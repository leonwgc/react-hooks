import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,a as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=r();function s(){let e=a.useRef(null),[t,n]=a.useState(!0),[r,s]=a.useState(0);return i(`click`,()=>s(e=>e+1),t?e:null),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e=>!e),children:t?`暂停监听`:`恢复监听`}),(0,o.jsx)(`button`,{ref:e,children:`触发原生点击`}),(0,o.jsxs)(`output`,{children:[`收到 `,r,` 次`]})]})}var c=`import * as React from "react";

import { useEventListener } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useEventListener("click", () => setCount((n) => n + 1), enabled ? ref : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停监听" : "恢复监听"}
      </button>
      <button ref={ref}>触发原生点击</button>
      <output>收到 {count} 次</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),t=a.useRef(null),[n,r]=a.useState([]);return i(`click`,()=>r(e=>[...e.slice(-5),`父捕获`]),e,{capture:!0}),i(`click`,()=>r(e=>[...e,`子点击`]),t),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,children:(0,o.jsx)(`button`,{ref:t,children:`观察事件顺序`})}),(0,o.jsx)(`button`,{onClick:()=>r([]),children:`清空事件记录`}),(0,o.jsx)(`output`,{children:n.join(` → `)||`等待点击`})]})}var u=`import * as React from "react";

import { useEventListener } from "../../../src";

function Case2() {
  const parent = React.useRef<HTMLDivElement>(null);
  const child = React.useRef<HTMLButtonElement>(null);
  const [log, setLog] = React.useState<string[]>([]);
  useEventListener(
    "click",
    () => setLog((s) => [...s.slice(-5), "父捕获"]),
    parent,
    { capture: true },
  );
  useEventListener("click", () => setLog((s) => [...s, "子点击"]), child);
  return (
    <>
      <div ref={parent}>
        <button ref={child}>观察事件顺序</button>
      </div>
      <button onClick={() => setLog([])}>清空事件记录</button>
      <output>{log.join(" → ") || "等待点击"}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`动态启停元素监听`,description:`传入 null 暂停绑定，恢复后继续监听按钮的原生 click。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`捕获与冒泡顺序`,description:`父元素捕获监听与子元素原生监听共同记录事件传播顺序。`,children:(0,o.jsx)(l,{})})]})}export{d as default};