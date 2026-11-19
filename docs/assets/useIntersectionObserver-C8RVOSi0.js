import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,o as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(null),n=a.useRef(null),r=i(n,{root:e,threshold:[0,.5,1]});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>e?.scrollTo({top:240,behavior:`smooth`}),children:`滚动到目标`}),(0,o.jsxs)(`div`,{ref:t,className:`scroll-pad`,children:[(0,o.jsx)(`div`,{style:{height:220},children:`向下滚动`}),(0,o.jsx)(`div`,{ref:n,className:`notice`,children:`观察目标`}),(0,o.jsx)(`div`,{style:{height:120}})]}),(0,o.jsxs)(`output`,{children:[`可见比例 `,Math.round((r?.intersectionRatio??0)*100),`%`]})]})}var c=`import * as React from "react";

import { useIntersectionObserver } from "../../../src";

function Case1() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, {
    root,
    threshold: [0, 0.5, 1],
  });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 240, behavior: "smooth" })}>
        滚动到目标
      </button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 220 }}>向下滚动</div>
        <div ref={target} className="notice">
          观察目标
        </div>
        <div style={{ height: 120 }} />
      </div>
      <output>
        可见比例 {Math.round((entry?.intersectionRatio ?? 0) * 100)}%
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(null),n=a.useRef(null),r=i(n,{root:e,rootMargin:`100px`});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>e?.scrollTo({top:120}),children:`滚动到预加载位置`}),(0,o.jsx)(`button`,{onClick:()=>e?.scrollTo({top:0}),children:`回到容器顶部`}),(0,o.jsxs)(`div`,{ref:t,className:`scroll-pad`,children:[(0,o.jsx)(`div`,{style:{height:320},children:`目标位于下面`}),(0,o.jsx)(`div`,{ref:n,children:`待预加载内容`})]}),(0,o.jsx)(`output`,{children:r?.isIntersecting?`进入预加载范围`:`尚未进入范围`})]})}var u=`import * as React from "react";

import { useIntersectionObserver } from "../../../src";

function Case2() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, { root, rootMargin: "100px" });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 120 })}>
        滚动到预加载位置
      </button>
      <button onClick={() => root?.scrollTo({ top: 0 })}>回到容器顶部</button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 320 }}>目标位于下面</div>
        <div ref={target}>待预加载内容</div>
      </div>
      <output>
        {entry?.isIntersecting ? "进入预加载范围" : "尚未进入范围"}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`指定滚动根容器`,description:`目标只相对内部滚动容器计算可见比例，滚动或按钮定位均可触发。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`预加载边距`,description:`使用 100px rootMargin 提前感知目标，不代表目标已经实际进入可见区域。`,children:(0,o.jsx)(l,{})})]})}export{d as default};