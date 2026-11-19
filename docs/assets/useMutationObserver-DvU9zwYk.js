import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{o as r}from"./interaction-a07diKrt.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i();function s(){let e=a.useRef(null),[t,n]=a.useState(0);return r(e,e=>n(t=>t+e.length),{attributes:!0,attributeFilter:[`data-status`]}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,className:`notice`,children:`外部插件宿主`}),(0,o.jsx)(`button`,{onClick:()=>e.current?.setAttribute(`data-status`,String(Date.now())),children:`修改观察属性`}),(0,o.jsx)(`button`,{onClick:()=>e.current?.setAttribute(`data-other`,String(Date.now())),children:`修改忽略属性`}),(0,o.jsxs)(`output`,{children:[`观察到 `,t,` 条属性变化`]})]})}var c=`import * as React from "react";

import { useMutationObserver } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    attributes: true,
    attributeFilter: ["data-status"],
  });
  return (
    <>
      <div ref={ref} className="notice">
        外部插件宿主
      </div>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-status", String(Date.now()))
        }
      >
        修改观察属性
      </button>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-other", String(Date.now()))
        }
      >
        修改忽略属性
      </button>
      <output>观察到 {count} 条属性变化</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),[t,n]=a.useState(0);return r(e,e=>n(t=>t+e.length),{childList:!0,subtree:!0}),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`div`,{ref:e,className:`notice`}),(0,o.jsx)(`button`,{onClick:()=>{let t=document.createElement(`p`);t.textContent=`外部段落`,e.current?.append(t)},children:`追加外部段落`}),(0,o.jsx)(`button`,{onClick:()=>e.current?.replaceChildren(),children:`清空外部内容`}),(0,o.jsxs)(`output`,{children:[`DOM 变更 `,t,` 条`]})]})}var u=`import * as React from "react";

import { useMutationObserver } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    childList: true,
    subtree: true,
  });
  return (
    <>
      <div ref={ref} className="notice" />
      <button
        onClick={() => {
          const node = document.createElement("p");
          node.textContent = "外部段落";
          ref.current?.append(node);
        }}
      >
        追加外部段落
      </button>
      <button onClick={() => ref.current?.replaceChildren()}>
        清空外部内容
      </button>
      <output>DOM 变更 {count} 条</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`观察指定属性`,description:`仅关注 data-status 的变化，其他属性变化不会计数。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`观察子树与删除节点`,description:`添加嵌套节点或清空宿主，观察 childList 和 subtree 的记录。`,children:(0,o.jsx)(l,{})})]})}export{d as default};