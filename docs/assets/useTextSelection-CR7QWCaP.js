import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{o as r}from"./browser-Dl19CO1P.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i();function s(){let e=a.useRef(null),t=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`p`,{ref:e,children:`这段内容可被引用到笔记中。`}),(0,o.jsx)(`button`,{onClick:()=>{if(!e.current)return;let t=document.createRange();t.selectNodeContents(e.current);let n=window.getSelection();n?.removeAllRanges(),n?.addRange(t)},children:`选中整段内容`}),(0,o.jsx)(`button`,{onClick:t.clear,children:`取消段落选中`}),(0,o.jsx)(`output`,{children:t.text||`无选区`})]})}var c=`import * as React from "react";

import { useTextSelection } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  return (
    <>
      <p ref={ref}>这段内容可被引用到笔记中。</p>
      <button
        onClick={() => {
          if (!ref.current) return;
          const range = document.createRange();
          range.selectNodeContents(ref.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }}
      >
        选中整段内容
      </button>
      <button onClick={s.clear}>取消段落选中</button>
      <output>{s.text || "无选区"}</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),t=r(e),[n,i]=a.useState(`尚未引用`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`p`,{ref:e,children:`受跟踪段落：选中这里可以生成引用。`}),(0,o.jsx)(`p`,{children:`外部段落：选中这里不会作为区域内选区返回。`}),(0,o.jsx)(`button`,{onMouseDown:e=>e.preventDefault(),onClick:()=>i(t.text||`请先选中受跟踪文字`),children:`保存选中引用`}),(0,o.jsx)(`output`,{children:n})]})}var u=`import * as React from "react";

import { useTextSelection } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  const [quote, setQuote] = React.useState("尚未引用");
  return (
    <>
      <p ref={ref}>受跟踪段落：选中这里可以生成引用。</p>
      <p>外部段落：选中这里不会作为区域内选区返回。</p>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setQuote(s.text || "请先选中受跟踪文字")}
      >
        保存选中引用
      </button>
      <output>{quote}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`按钮创建段落选区`,description:`使用浏览器 Selection API 选中段落，Hook 读取真实选区，清除按钮移除选中。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`限制到指定区域`,description:`分别选中两个段落，只有受跟踪区域内的选区才会返回文本。`,children:(0,o.jsx)(l,{})})]})}export{d as default};