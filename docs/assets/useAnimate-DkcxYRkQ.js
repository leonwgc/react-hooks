import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./animation-D3LhXGrr.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let e=a.useRef(null),t=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,className:`notice`,children:`操作已完成`}),(0,o.jsx)(`button`,{onClick:()=>t.play([{opacity:0},{opacity:1}],{duration:700,fill:`forwards`}),children:`播放淡入反馈`}),(0,o.jsx)(`button`,{onClick:t.cancel,children:`取消淡入反馈`}),(0,o.jsxs)(`output`,{children:[`动画状态 `,t.status]})]})}var c=`import * as React from "react";

import { useAnimate } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const a = useAnimate(ref);
  return (
    <>
      <div ref={ref} className="notice">
        操作已完成
      </div>
      <button
        onClick={() =>
          a.play([{ opacity: 0 }, { opacity: 1 }], {
            duration: 700,
            fill: "forwards",
          })
        }
      >
        播放淡入反馈
      </button>
      <button onClick={a.cancel}>取消淡入反馈</button>
      <output>动画状态 {a.status}</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),t=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{className:`animation-stage`,children:(0,o.jsx)(`div`,{ref:e,className:`animation-orb`,children:`↔`})}),(0,o.jsx)(`button`,{onClick:()=>t.play({transform:[`translateX(0)`,`translateX(80px)`]},{duration:500,direction:`alternate`,iterations:4}),children:`播放往返动画`}),(0,o.jsx)(`button`,{onClick:t.pause,children:`暂停往返`}),(0,o.jsx)(`button`,{onClick:t.resume,children:`恢复往返`}),(0,o.jsx)(`output`,{children:t.status})]})}var u=`import * as React from "react";

import { useAnimate } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const a = useAnimate(ref);
  return (
    <>
      <div className="animation-stage">
        <div ref={ref} className="animation-orb">
          ↔
        </div>
      </div>
      <button
        onClick={() =>
          a.play(
            { transform: ["translateX(0)", "translateX(80px)"] },
            { duration: 500, direction: "alternate", iterations: 4 },
          )
        }
      >
        播放往返动画
      </button>
      <button onClick={a.pause}>暂停往返</button>
      <button onClick={a.resume}>恢复往返</button>
      <output>{a.status}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`淡入反馈与完成状态`,description:`播放短暂淡入动画，完成后状态变为 finished，取消可恢复初始样式。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`往返动画与重播`,description:`使用 alternate 和有限 iterations；运行中重播会取消上一段动画。`,children:(0,o.jsx)(l,{})})]})}export{d as default};