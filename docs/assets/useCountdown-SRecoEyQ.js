import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,r as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(null),[n,r]=a.useState(0),s=i(e,{interval:100,onEnd:()=>r(e=>e+1)});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(Date.now()+3e3),children:`开始三秒倒计时`}),(0,o.jsx)(`button`,{onClick:()=>t(null),children:`取消倒计时`}),(0,o.jsxs)(`output`,{children:[`剩余 `,Math.ceil(s.remaining/1e3),`s · 已结束 `,n,` 次`]})]})}var c=`import * as React from "react";

import { useCountdown } from "../../../src";

function Case1() {
  const [target, setTarget] = React.useState<number | null>(null);
  const [ends, setEnds] = React.useState(0);
  const c = useCountdown(target, {
    interval: 100,
    onEnd: () => setEnds((n) => n + 1),
  });
  return (
    <>
      <button onClick={() => setTarget(Date.now() + 3000)}>
        开始三秒倒计时
      </button>
      <button onClick={() => setTarget(null)}>取消倒计时</button>
      <output>
        剩余 {Math.ceil(c.remaining / 1000)}s · 已结束 {ends} 次
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(null),n=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(Date.now()-1e3),children:`设置过期目标`}),(0,o.jsx)(`button`,{onClick:()=>t(Date.now()+65e3),children:`设置 65 秒目标`}),(0,o.jsx)(`button`,{onClick:()=>t(e=>(e??Date.now())+1e4),children:`延长十秒`}),(0,o.jsxs)(`output`,{children:[Math.floor(n.seconds/60),` 分 `,n.seconds%60,` 秒 · 剩余 `,n.remaining,`ms`]})]})}var u=`import * as React from "react";

import { useCountdown } from "../../../src";

function Case2() {
  const [target, setTarget] = React.useState<number | null>(null);
  const c = useCountdown(target);
  return (
    <>
      <button onClick={() => setTarget(Date.now() - 1000)}>设置过期目标</button>
      <button onClick={() => setTarget(Date.now() + 65000)}>
        设置 65 秒目标
      </button>
      <button onClick={() => setTarget((t) => (t ?? Date.now()) + 10000)}>
        延长十秒
      </button>
      <output>
        {Math.floor(c.seconds / 60)} 分 {c.seconds % 60} 秒 · 剩余 {c.remaining}
        ms
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`截止回调与重新启动`,description:`设置三秒目标，结束后记录回调次数；可提前取消或重新计时。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`过期目标与延长截止`,description:`传入过去时间立即得到零；新目标会重新计算剩余时间。`,children:(0,o.jsx)(l,{})})]})}export{d as default};