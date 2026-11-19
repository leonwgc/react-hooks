import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{r}from"./effects-Kb5q3qQz.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(0),[n,i]=a.useState(500),[s,c]=a.useState(!1);return r(()=>t(e=>e+1),s?n:null),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`计时周期`,(0,o.jsxs)(`select`,{value:n,onChange:e=>i(Number(e.target.value)),children:[(0,o.jsx)(`option`,{value:200,children:`200ms`}),(0,o.jsx)(`option`,{value:1e3,children:`1000ms`}),(0,o.jsx)(`option`,{value:500,children:`500ms`})]})]}),(0,o.jsx)(`button`,{onClick:()=>c(e=>!e),children:s?`暂停计数`:`开始计数`}),(0,o.jsxs)(`output`,{children:[`累计 `,e,` 次`]})]})}var c=`import * as React from "react";

import { useInterval } from "../../../src";

function Case1() {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(500);
  const [active, setActive] = React.useState(false);
  useInterval(() => setCount((n) => n + 1), active ? delay : null);
  return (
    <>
      <label>
        计时周期
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        >
          <option value={200}>200ms</option>
          <option value={1000}>1000ms</option>
          <option value={500}>500ms</option>
        </select>
      </label>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "暂停计数" : "开始计数"}
      </button>
      <output>累计 {count} 次</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(0),[n,i]=a.useState(!1);return r(()=>t(e=>e+1),n?2e3:null,!0),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>i(e=>!e),children:n?`停用即时任务`:`启用即时任务`}),(0,o.jsxs)(`output`,{children:[`任务执行 `,e,` 次`]}),(0,o.jsx)(`p`,{children:`开发 Strict Mode 的挂载检查可能重复执行初始化任务，实际写操作请保持幂等。`})]})}var u=`import * as React from "react";

import { useInterval } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(0);
  const [active, setActive] = React.useState(false);
  useInterval(() => setCount((n) => n + 1), active ? 2000 : null, true);
  return (
    <>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "停用即时任务" : "启用即时任务"}
      </button>
      <output>任务执行 {count} 次</output>
      <p>
        开发 Strict Mode
        的挂载检查可能重复执行初始化任务，实际写操作请保持幂等。
      </p>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`调整节奏与暂停`,description:`在运行时改变间隔，暂停后保留计数，恢复后按新间隔继续。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`启用时立即执行`,description:`immediate 为 true 时，启用定时器立即执行一次，然后按间隔运行。`,children:(0,o.jsx)(l,{})})]})}export{d as default};