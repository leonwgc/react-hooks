import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,f as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=r();function s(){let e=a.useRef(null),{x:t}=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>e.current?.scrollBy({left:180,behavior:`smooth`}),children:`向右浏览`}),(0,o.jsx)(`button`,{onClick:()=>e.current?.scrollTo({left:0}),children:`回到左端`}),(0,o.jsx)(`div`,{ref:e,style:{overflow:`auto`,maxWidth:`100%`},children:(0,o.jsx)(`div`,{style:{width:900,padding:20},children:`栏目一　　栏目二　　栏目三　　栏目四`})}),(0,o.jsxs)(`output`,{children:[`水平位置 `,Math.round(t),`px`]})]})}var c=`import * as React from "react";

import { useScroll } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { x } = useScroll(ref);
  return (
    <>
      <button
        onClick={() => ref.current?.scrollBy({ left: 180, behavior: "smooth" })}
      >
        向右浏览
      </button>
      <button onClick={() => ref.current?.scrollTo({ left: 0 })}>
        回到左端
      </button>
      <div ref={ref} style={{ overflow: "auto", maxWidth: "100%" }}>
        <div style={{ width: 900, padding: 20 }}>
          栏目一　　栏目二　　栏目三　　栏目四
        </div>
      </div>
      <output>水平位置 {Math.round(x)}px</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),{y:t}=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,className:`scroll-pad`,children:(0,o.jsx)(`div`,{style:{height:600},children:`长文章内容，向下滚动阅读。`})}),(0,o.jsx)(`progress`,{"aria-label":`容器阅读进度`,value:t,max:Math.max(1,(e.current?.scrollHeight??600)-(e.current?.clientHeight??180))}),(0,o.jsx)(`button`,{onClick:()=>e.current?.scrollTo({top:0,behavior:`smooth`}),children:`回到阅读顶部`}),(0,o.jsxs)(`output`,{children:[`已阅读偏移 `,Math.round(t),`px`]})]})}var u=`import * as React from "react";

import { useScroll } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { y } = useScroll(ref);
  return (
    <>
      <div ref={ref} className="scroll-pad">
        <div style={{ height: 600 }}>长文章内容，向下滚动阅读。</div>
      </div>
      <progress
        aria-label="容器阅读进度"
        value={y}
        max={Math.max(
          1,
          (ref.current?.scrollHeight ?? 600) -
            (ref.current?.clientHeight ?? 180),
        )}
      />
      <button
        onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
      >
        回到阅读顶部
      </button>
      <output>已阅读偏移 {Math.round(y)}px</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`横向滚动位置`,description:`横向容器使用 x 值；按钮和手动滚动共用同一真实滚动状态。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`阅读进度与回到顶部`,description:`依据容器 scrollHeight 计算阅读进度，滚动一段后显示返回按钮。`,children:(0,o.jsx)(l,{})})]})}export{d as default};