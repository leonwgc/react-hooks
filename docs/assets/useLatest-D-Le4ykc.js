import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,S as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(`初稿`),n=i(e),[r,s]=a.useState(`未读取`),c=a.useRef(new EventTarget);return a.useEffect(()=>{let e=()=>s(n.current),t=c.current;return t.addEventListener(`read`,e),()=>t.removeEventListener(`read`,e)},[n]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`最新草稿`,(0,o.jsx)(`input`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsx)(`button`,{onClick:()=>c.current.dispatchEvent(new Event(`read`)),children:`触发长期订阅`}),(0,o.jsx)(`output`,{children:r})]})}var c=`import * as React from "react";

import { useLatest } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("初稿");
  const latest = useLatest(text);
  const [read, setRead] = React.useState("未读取");
  const bus = React.useRef(new EventTarget());
  React.useEffect(() => {
    const read = () => setRead(latest.current);
    const target = bus.current;
    target.addEventListener("read", read);
    return () => target.removeEventListener("read", read);
  }, [latest]);
  return (
    <>
      <label>
        最新草稿
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button onClick={() => bus.current.dispatchEvent(new Event("read"))}>
        触发长期订阅
      </button>
      <output>{read}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`输入值`),n=i(e),[r,s]=a.useState(`未读取`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`传入值`,(0,o.jsx)(`input`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsx)(`button`,{onClick:()=>{n.current=`临时值`,s(`事件内读取：`+n.current)},children:`事件内修改引用`}),(0,o.jsx)(`button`,{onClick:()=>s(`重新读取：`+n.current),children:`读取同步后的引用`}),(0,o.jsx)(`output`,{children:r})]})}var u=`import * as React from "react";

import { useLatest } from "../../../src";

function Case2() {
  const [value, setValue] = React.useState("输入值");
  const ref = useLatest(value);
  const [log, setLog] = React.useState("未读取");
  return (
    <>
      <label>
        传入值
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button
        onClick={() => {
          ref.current = "临时值";
          setLog("事件内读取：" + ref.current);
        }}
      >
        事件内修改引用
      </button>
      <button onClick={() => setLog("重新读取：" + ref.current)}>
        读取同步后的引用
      </button>
      <output>{log}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`长期订阅读取最新草稿`,description:`事件监听只安装一次，修改输入后触发事件仍能读到最新内容。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`引用更新不主动渲染`,description:`在事件中暂存 ref 值并读取；下一次渲染会再次同步传入值。`,children:(0,o.jsx)(l,{})})]})}export{d as default};