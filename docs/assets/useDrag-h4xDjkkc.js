import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r,t as i}from"./interaction-a07diKrt.js";import{D as a}from"./index-C6jdXK2z.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(`等待卡片`),n=JSON.stringify({id:7,title:`任务卡片`}),a=i(n,{type:`application/x-hook-card`,effectAllowed:`copy`}),c=e=>{try{let n=JSON.parse(e);t(JSON.stringify(n))}catch{t(`数据格式错误`)}},l=r(({text:e})=>c(e),{type:`application/x-hook-card`,dropEffect:`copy`});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`div`,{...a.bind,className:`notice`,children:`拖动 JSON 卡片`}),(0,s.jsx)(`div`,{...l.bind,className:`notice`,children:l.over?`松开以接收`:e}),(0,s.jsx)(`button`,{onClick:()=>c(n),children:`键盘发送 JSON 卡片`})]})}var l=`import * as React from "react";

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
`;function f(){let[e,t]=o.useState(!0),n=i(`临时卡片`);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>t(!0),children:`恢复拖拽源`}),e?(0,s.jsx)(`div`,{className:`notice`,...n.bind,onDragStart:e=>{n.bind.onDragStart(e),setTimeout(()=>t(!1),300)},children:`拖动我：300ms 后此卡片会被移除`}):(0,s.jsx)(`p`,{children:`拖拽源已卸载，它的 dragend 不会再触发。`}),(0,s.jsxs)(`output`,{children:[`dragging：`,String(n.dragging)]}),(0,s.jsx)(`p`,{children:`松开鼠标（drop）或下一次按下指针时，dragging 会自动复位为 false。`})]})}var p=`import * as React from "react";

import { useDrag } from "../../../src";

function Feature1() {
  const [visible, setVisible] = React.useState(true);
  const drag = useDrag("临时卡片");
  return (
    <>
      <button onClick={() => setVisible(true)}>恢复拖拽源</button>
      {visible ? (
        <div
          className="notice"
          {...drag.bind}
          onDragStart={(event) => {
            drag.bind.onDragStart(event);
            // Simulate a list refresh removing the source while it is being dragged.
            setTimeout(() => setVisible(false), 300);
          }}
        >
          拖动我：300ms 后此卡片会被移除
        </div>
      ) : (
        <p>拖拽源已卸载，它的 dragend 不会再触发。</p>
      )}
      <output>dragging：{String(drag.dragging)}</output>
      <p>松开鼠标（drop）或下一次按下指针时，dragging 会自动复位为 false。</p>
    </>
  );
}

export default Feature1;
`;function m(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`自定义 MIME 数据`,description:`拖放双方约定同一个数据类型，传递 JSON 文本并解析；按钮提供等价业务动作。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`只读时禁用拖动`,description:`切换 disabled 后 draggable 状态变化，目标区域继续支持正常接收。`,children:(0,s.jsx)(u,{})}),(0,s.jsx)(e,{source:p,title:`拖拽源中途卸载后复位`,description:`拖动开始 300ms 后卡片被移除，dragend 不再触发；drop 或下一次按下指针时 dragging 自动复位。`,children:(0,s.jsx)(f,{})})]})}export{m as default};