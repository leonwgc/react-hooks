import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{r}from"./animation-D3LhXGrr.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let e=r(),[t,n]=a.useState(!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e=>!e),children:`切换偏好感知面板`}),(0,o.jsx)(`div`,{className:`notice`,style:{opacity:t?1:.25,transition:e?`none`:`opacity 600ms`},children:`偏好感知内容`}),(0,o.jsx)(`output`,{children:e?`无过渡`:`600ms 淡入淡出`})]})}var c=`import * as React from "react";

import { useReducedMotion } from "../../../src";

function Case1() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>切换偏好感知面板</button>
      <div
        className="notice"
        style={{
          opacity: open ? 1 : 0.25,
          transition: reduced ? "none" : "opacity 600ms",
        }}
      >
        偏好感知内容
      </div>
      <output>{reduced ? "无过渡" : "600ms 淡入淡出"}</output>
    </>
  );
}

export default Case1;
`;function l(){let e=r(),[t,n]=a.useState(!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e=>!e),children:`切换完成状态`}),(0,o.jsx)(`div`,{className:`notice`,style:{transform:!e&&t?`translateX(20px)`:`none`,transition:e?`none`:`transform 300ms`,color:t?`var(--accent)`:`var(--text)`},children:t?`已完成`:`待完成`}),(0,o.jsxs)(`output`,{children:[`系统偏好：`,e?`减少运动`:`允许运动`]})]})}var u=`import * as React from "react";

import { useReducedMotion } from "../../../src";

function Case2() {
  const reduced = useReducedMotion();
  const [done, setDone] = React.useState(false);
  return (
    <>
      <button onClick={() => setDone((v) => !v)}>切换完成状态</button>
      <div
        className="notice"
        style={{
          transform: !reduced && done ? "translateX(20px)" : "none",
          transition: reduced ? "none" : "transform 300ms",
          color: done ? "var(--accent)" : "var(--text)",
        }}
      >
        {done ? "已完成" : "待完成"}
      </div>
      <output>系统偏好：{reduced ? "减少运动" : "允许运动"}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`按系统偏好切换过渡`,description:`展开面板时，系统要求减少动画则立即切换；可在系统设置或浏览器媒体模拟中改变偏好。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`交互触发的动画替代`,description:`完整模式移动位置，减少动态模式仅改变文字和颜色，不强制开启运动。`,children:(0,o.jsx)(l,{})})]})}export{d as default};