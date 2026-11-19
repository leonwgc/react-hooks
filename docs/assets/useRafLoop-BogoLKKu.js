import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./animation-C673y_Ga.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(20),[n,i]=a.useState(0),s=r(({delta:t})=>i(n=>(n+t*e/1e3)%100),!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`每秒速率`,(0,o.jsx)(`input`,{type:`range`,min:5,max:80,value:e,onChange:e=>t(Number(e.target.value))})]}),(0,o.jsx)(`button`,{onClick:s.start,children:`开始按速度推进`}),(0,o.jsx)(`button`,{onClick:s.stop,children:`停止推进`}),(0,o.jsx)(`progress`,{"aria-label":`速度演示进度`,max:100,value:n}),(0,o.jsxs)(`output`,{children:[s.running?`运行中`:`已停止`,` · `,Math.round(n),`%`]})]})}var c=`import * as React from "react";

import { useRafLoop } from "../../../src";

function Case1() {
  const [speed, setSpeed] = React.useState(20);
  const [value, setValue] = React.useState(0);
  const loop = useRafLoop(
    ({ delta }) => setValue((n) => (n + (delta * speed) / 1000) % 100),
    false,
  );
  return (
    <>
      <label>
        每秒速率
        <input
          type="range"
          min={5}
          max={80}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
      <button onClick={loop.start}>开始按速度推进</button>
      <button onClick={loop.stop}>停止推进</button>
      <progress aria-label="速度演示进度" max={100} value={value} />
      <output>
        {loop.running ? "运行中" : "已停止"} · {Math.round(value)}%
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(0),n=r(e=>t(e.delta),!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:n.start,children:`开始帧采样`}),(0,o.jsx)(`button`,{onClick:n.stop,children:`停止帧采样`}),(0,o.jsxs)(`output`,{children:[`帧间隔 `,e.toFixed(1),`ms · 近似`,` `,e>0?Math.round(1e3/e):0,`fps`]}),(0,o.jsx)(`p`,{children:`切回标签页可能出现大间隔，数值只用于诊断观察。`})]})}var u=`import * as React from "react";

import { useRafLoop } from "../../../src";

function Case2() {
  const [delta, setDelta] = React.useState(0);
  const loop = useRafLoop((frame) => setDelta(frame.delta), false);
  return (
    <>
      <button onClick={loop.start}>开始帧采样</button>
      <button onClick={loop.stop}>停止帧采样</button>
      <output>
        帧间隔 {delta.toFixed(1)}ms · 近似{" "}
        {delta > 0 ? Math.round(1000 / delta) : 0}fps
      </output>
      <p>切回标签页可能出现大间隔，数值只用于诊断观察。</p>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`基于 delta 的速度控制`,description:`改变每秒速率后，进度仍按真实帧间隔推进，开始和停止均可重复调用。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`帧间隔采样`,description:`实时采样 delta 并展示近似帧率；停止后保持最后一次采样结果。`,children:(0,o.jsx)(l,{})})]})}export{d as default};