import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r,t as i}from"./interaction-DviRGHpE.js";import{D as a}from"./index-DcZxIQAI.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(`等待卡片`),n=JSON.stringify({id:7,title:`任务卡片`}),a=i(n,{type:`application/x-hook-card`,effectAllowed:`copy`}),c=e=>{try{let n=JSON.parse(e);t(JSON.stringify(n))}catch{t(`数据格式错误`)}},l=r(({text:e})=>c(e),{type:`application/x-hook-card`,dropEffect:`copy`});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`div`,{...a.bind,className:`notice`,children:`拖动 JSON 卡片`}),(0,s.jsx)(`div`,{...l.bind,className:`notice`,children:l.over?`松开以接收`:e}),(0,s.jsx)(`button`,{onClick:()=>c(n),children:`键盘发送 JSON 卡片`})]})}var l=`import * as React from "react";

import { useDrag, useDrop } from "../../../src";

function Case1() {
  const [result, setResult] = React.useState("等待卡片");
  const payload = JSON.stringify({ id: 7, title: "任务卡片" });
  const drag = useDrag(payload, {
    type: "application/x-hook-card",
    effectAllowed: "copy",
  });
  const accept = (text: string) => {
    try {
      const value: unknown = JSON.parse(text);
      setResult(JSON.stringify(value));
    } catch {
      setResult("数据格式错误");
    }
  };
  const drop = useDrop(({ text }) => accept(text), {
    type: "application/x-hook-card",
    dropEffect: "copy",
  });
  return (
    <>
      <div {...drag.bind} className="notice">
        拖动 JSON 卡片
      </div>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开以接收" : result}
      </div>
      <button onClick={() => accept(payload)}>键盘发送 JSON 卡片</button>
    </>
  );
}

export default Case1;
`;function u(){let[e,t]=o.useState(!0),[n,a]=o.useState(`无`),c=i(`受控卡片`,{disabled:e}),l=r(({text:e})=>a(e));return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`允许拖动`:`锁定拖动`}),(0,s.jsx)(`div`,{...c.bind,className:`notice`,children:e?`卡片已锁定`:`可拖动卡片`}),(0,s.jsxs)(`div`,{...l.bind,className:`notice`,children:[`接收：`,n]}),(0,s.jsx)(`button`,{disabled:e,onClick:()=>a(`受控卡片`),children:`键盘移动卡片`})]})}var d=`import * as React from "react";

import { useDrag, useDrop } from "../../../src";

function Case2() {
  const [disabled, setDisabled] = React.useState(true);
  const [result, setResult] = React.useState("无");
  const drag = useDrag("受控卡片", { disabled });
  const drop = useDrop(({ text }) => setResult(text));
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "允许拖动" : "锁定拖动"}
      </button>
      <div {...drag.bind} className="notice">
        {disabled ? "卡片已锁定" : "可拖动卡片"}
      </div>
      <div {...drop.bind} className="notice">
        接收：{result}
      </div>
      <button disabled={disabled} onClick={() => setResult("受控卡片")}>
        键盘移动卡片
      </button>
    </>
  );
}

export default Case2;
`;function f(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`自定义 MIME 数据`,description:`拖放双方约定同一个数据类型，传递 JSON 文本并解析；按钮提供等价业务动作。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`只读时禁用拖动`,description:`切换 disabled 后 draggable 状态变化，目标区域继续支持正常接收。`,children:(0,s.jsx)(u,{})})]})}export{f as default};