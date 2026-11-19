import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./document-Cpw2fSNP.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(0);return r(e?`(${e}) 新消息`:`消息中心`),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>e+1),children:`收到一条演示消息`}),(0,o.jsx)(`button`,{onClick:()=>t(0),children:`标记全部已读`}),(0,o.jsxs)(`output`,{children:[`未读 `,e,` 条，查看浏览器标题。`]})]})}var c=`import * as React from "react";

import { useDocumentTitle } from "../../../src";

function Case1() {
  const [count, setCount] = React.useState(0);
  useDocumentTitle(count ? \`(\${count}) 新消息\` : "消息中心");
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>收到一条演示消息</button>
      <button onClick={() => setCount(0)}>标记全部已读</button>
      <output>未读 {count} 条，查看浏览器标题。</output>
    </>
  );
}

export default Case1;
`;function l(){return r(`临时预览标题`),(0,o.jsx)(`p`,{children:`临时标题拥有者已挂载。`})}function u(){r(`场景父标题`);let[e,t]=a.useState(!1);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`关闭临时标题`:`打开临时标题`}),e&&(0,o.jsx)(l,{}),(0,o.jsx)(`p`,{children:`观察标签标题的接管与恢复。`})]})}var d=`import * as React from "react";

import { useDocumentTitle } from "../../../src";

function TemporaryTitle() {
  useDocumentTitle("临时预览标题");
  return <p>临时标题拥有者已挂载。</p>;
}

function Case2() {
  useDocumentTitle("场景父标题");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "关闭临时标题" : "打开临时标题"}
      </button>
      {open && <TemporaryTitle />}
      <p>观察标签标题的接管与恢复。</p>
    </>
  );
}

export default Case2;
`;function f(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`未读消息标题`,description:`改变未读数量，实时将数量反映到浏览器标题中。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:d,title:`临时标题与卸载恢复`,description:`显示临时子组件后，它接管标题；关闭子组件恢复当前场景标题。`,children:(0,o.jsx)(u,{})})]})}export{f as default};