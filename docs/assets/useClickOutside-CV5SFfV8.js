import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,t as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=r();function s(){let e=a.useRef(null),[t,n]=a.useState(!0),[r,s]=a.useState(!0);return i(e,()=>n(!1),r),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>s(e=>!e),children:r?`停用外部关闭`:`启用外部关闭`}),(0,o.jsxs)(`div`,{ref:e,children:[(0,o.jsx)(`button`,{onClick:()=>n(!0),children:`展开浮层`}),t&&(0,o.jsx)(`p`,{className:`notice`,children:`面板内容`})]}),(0,o.jsx)(`button`,{children:`点击这里属于外部`}),(0,o.jsx)(`output`,{children:t?`浮层打开`:`浮层关闭`})]})}var c=`import * as React from "react";

import { useClickOutside } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(true);
  const [enabled, setEnabled] = React.useState(true);
  useClickOutside(ref, () => setOpen(false), enabled);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用外部关闭" : "启用外部关闭"}
      </button>
      <div ref={ref}>
        <button onClick={() => setOpen(true)}>展开浮层</button>
        {open && <p className="notice">面板内容</p>}
      </div>
      <button>点击这里属于外部</button>
      <output>{open ? "浮层打开" : "浮层关闭"}</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),[t,n]=a.useState(`尚未外部点击`);return i(e,e=>n(`外部目标：`+(e.target instanceof HTMLElement?e.target.tagName:`未知`))),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,className:`notice`,children:(0,o.jsx)(`button`,{children:`内部按钮不会触发`})}),(0,o.jsx)(`button`,{children:`外部按钮触发记录`}),(0,o.jsx)(`output`,{children:t})]})}var u=`import * as React from "react";

import { useClickOutside } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [log, setLog] = React.useState("尚未外部点击");
  useClickOutside(ref, (e) =>
    setLog(
      "外部目标：" +
        (e.target instanceof HTMLElement ? e.target.tagName : "未知"),
    ),
  );
  return (
    <>
      <div ref={ref} className="notice">
        <button>内部按钮不会触发</button>
      </div>
      <button>外部按钮触发记录</button>
      <output>{log}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`暂停外部关闭`,description:`关闭监听后点击外部区域不再关闭面板。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`记录外部点击来源`,description:`读取原生 PointerEvent，区分目标内部和外部触发。`,children:(0,o.jsx)(l,{})})]})}export{d as default};