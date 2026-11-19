import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,d as i}from"./index-BH-UjxLV.js";import{r as a}from"./effects-1iG2GRbG.js";var o=t(n(),1),s=r();function c(){let e=i(),[t,n]=o.useState(!1),[r,c]=o.useState(0);return a(()=>c(e=>e+1),t&&e===`visible`?500:null),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>n(e=>!e),children:t?`停止可见轮询`:`启动可见轮询`}),(0,s.jsxs)(`output`,{children:[e,` · 已轮询 `,r,` 次`]})]})}var l=`import * as React from "react";

import { usePageVisibility, useInterval } from "../../../src";

function Case1() {
  const visibility = usePageVisibility();
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(0);
  useInterval(
    () => setCount((n) => n + 1),
    active && visibility === "visible" ? 500 : null,
  );
  return (
    <>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "停止可见轮询" : "启动可见轮询"}
      </button>
      <output>
        {visibility} · 已轮询 {count} 次
      </output>
    </>
  );
}

export default Case1;
`;function u(){let e=i(),t=o.useRef(e),[n,r]=o.useState(0);return o.useEffect(()=>{t.current===`hidden`&&e===`visible`&&r(e=>e+1),t.current=e},[e]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`output`,{children:[`返回页面 `,n,` 次 · `,e]}),(0,s.jsx)(`button`,{onClick:()=>r(0),children:`清空返回记录`}),(0,s.jsx)(`p`,{children:`请切换标签页后再回来。`})]})}var d=`import * as React from "react";

import { usePageVisibility } from "../../../src";

function Case2() {
  const visibility = usePageVisibility();
  const previous = React.useRef(visibility);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (previous.current === "hidden" && visibility === "visible")
      setCount((n) => n + 1);
    previous.current = visibility;
  }, [visibility]);
  return (
    <>
      <output>
        返回页面 {count} 次 · {visibility}
      </output>
      <button onClick={() => setCount(0)}>清空返回记录</button>
      <p>请切换标签页后再回来。</p>
    </>
  );
}

export default Case2;
`;function f(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`仅在可见时轮询`,description:`手动启动后切换标签页，页面隐藏时传入 null 暂停定时任务。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`记录页面返回次数`,description:`切换到其他标签页再返回，记录从 hidden 到 visible 的真实变化。`,children:(0,s.jsx)(u,{})})]})}export{f as default};