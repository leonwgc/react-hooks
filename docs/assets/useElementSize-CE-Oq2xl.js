import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let e=a.useRef(null),[t,n]=a.useState(70),r=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`容器宽度百分比`,(0,o.jsx)(`input`,{type:`range`,min:30,max:100,value:t,onChange:e=>n(Number(e.target.value))})]}),(0,o.jsx)(`div`,{ref:e,className:`notice`,style:{width:t+`%`,boxSizing:`border-box`},children:`尺寸观察区域`}),(0,o.jsxs)(`output`,{children:[Math.round(r.width),` × `,Math.round(r.height),` px`]})]})}var c=`import * as React from "react";

import { useElementSize } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(70);
  const size = useElementSize(ref);
  return (
    <>
      <label>
        容器宽度百分比
        <input
          type="range"
          min={30}
          max={100}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div
        ref={ref}
        className="notice"
        style={{ width: width + "%", boxSizing: "border-box" }}
      >
        尺寸观察区域
      </div>
      <output>
        {Math.round(size.width)} × {Math.round(size.height)} px
      </output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),[t,n]=a.useState(1),r=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e=>e===4?1:e+1),children:`增加段落或重置`}),(0,o.jsx)(`div`,{ref:e,children:Array.from({length:t},(e,t)=>(0,o.jsxs)(`p`,{children:[`第 `,t+1,` 段动态内容`]},t))}),(0,o.jsxs)(`output`,{children:[`内容高度 `,Math.round(r.height),`px`]})]})}var u=`import * as React from "react";

import { useElementSize } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState(1);
  const size = useElementSize(ref);
  return (
    <>
      <button onClick={() => setRows((n) => (n === 4 ? 1 : n + 1))}>
        增加段落或重置
      </button>
      <div ref={ref}>
        {Array.from({ length: rows }, (_, i) => (
          <p key={i}>第 {i + 1} 段动态内容</p>
        ))}
      </div>
      <output>内容高度 {Math.round(size.height)}px</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`通过控件改变容器宽度`,description:`滑块修改容器 CSS 宽度，观察 ResizeObserver 发布的实际尺寸。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`内容驱动高度变化`,description:`添加和移除段落，观察同一元素高度变化，无需监听窗口 resize。`,children:(0,o.jsx)(l,{})})]})}export{d as default};