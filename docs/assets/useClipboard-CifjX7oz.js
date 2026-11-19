import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,n as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(`可编辑的分享内容`),n=i();return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`待复制文本`,(0,o.jsx)(`textarea`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsx)(`button`,{onClick:()=>void n.copy(e),children:`复制当前文本`}),(0,o.jsx)(`output`,{children:n.copied?`复制成功`:`尚未复制`}),!!n.error&&(0,o.jsx)(`p`,{role:`alert`,children:`复制失败，请手动选择文本。`})]})}var c=`import * as React from "react";

import { useClipboard } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("可编辑的分享内容");
  const c = useClipboard();
  return (
    <>
      <label>
        待复制文本
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button onClick={() => void c.copy(text)}>复制当前文本</button>
      <output>{c.copied ? "复制成功" : "尚未复制"}</output>
      {!!c.error && <p role="alert">复制失败，请手动选择文本。</p>}
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(1),n=i(),r=JSON.stringify({product:`Hooks`,quantity:e},null,2);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>e+1),children:`增加数量`}),(0,o.jsx)(`pre`,{children:r}),(0,o.jsx)(`button`,{onClick:()=>void n.copy(r),children:`复制 JSON`}),(0,o.jsx)(`output`,{children:n.copied?`JSON 已复制`:`等待复制 JSON`}),!!n.error&&(0,o.jsx)(`p`,{role:`alert`,children:`当前环境无法复制，请选择上方 JSON。`})]})}var u=`import * as React from "react";

import { useClipboard } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(1);
  const c = useClipboard();
  const text = JSON.stringify({ product: "Hooks", quantity: count }, null, 2);
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>增加数量</button>
      <pre>{text}</pre>
      <button onClick={() => void c.copy(text)}>复制 JSON</button>
      <output>{c.copied ? "JSON 已复制" : "等待复制 JSON"}</output>
      {!!c.error && <p role="alert">当前环境无法复制，请选择上方 JSON。</p>}
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`复制用户编辑的文本`,description:`复制当前输入，失败时保留文本供手动选择。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`复制结构化数据`,description:`先序列化业务对象，再复制可读的 JSON 文本。`,children:(0,o.jsx)(l,{})})]})}export{d as default};