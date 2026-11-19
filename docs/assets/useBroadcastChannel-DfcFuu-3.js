import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./browser-v7utc5zC.js";import{D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let e=e=>{if(!e||typeof e!=`object`||!(`count`in e)||typeof e.count!=`number`)throw Error(`消息格式错误`);return{count:e.count}},t=r(`hooks-examples-object`,e),n=r(`hooks-examples-object`,e),[i,s]=a.useState(0);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:!t.supported,onClick:()=>{s(e=>e+1),t.postMessage({count:i+1})},children:`发送对象计数`}),(0,o.jsxs)(`output`,{children:[`接收计数 `,n.message?.count??`暂无`,t.supported?``:` · 浏览器不支持`]}),!!n.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(n.error)})]})}var c=`import * as React from "react";

import { useBroadcastChannel } from "../../../src";

function Case1() {
  const parse = (v: unknown) => {
    if (
      !v ||
      typeof v !== "object" ||
      !("count" in v) ||
      typeof v.count !== "number"
    )
      throw Error("消息格式错误");
    return { count: v.count };
  };
  const a = useBroadcastChannel("hooks-examples-object", parse);
  const b = useBroadcastChannel("hooks-examples-object", parse);
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button
        disabled={!a.supported}
        onClick={() => {
          setCount((n) => n + 1);
          a.postMessage({ count: count + 1 });
        }}
      >
        发送对象计数
      </button>
      <output>
        接收计数 {b.message?.count ?? "暂无"}
        {!a.supported ? " · 浏览器不支持" : ""}
      </output>
      {!!b.error && <p role="alert">{String(b.error)}</p>}
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`B`),n=e=>String(e),i=r(`hooks-channel-A`,n),s=r(`hooks-channel-`+e,n);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>e===`A`?`B`:`A`),children:`切换接收频道`}),(0,o.jsx)(`button`,{disabled:!i.supported,onClick:()=>i.postMessage(`来自 A 的消息`),children:`向 A 发送消息`}),(0,o.jsxs)(`output`,{children:[`当前频道 `,e,` · `,s.message??`未收到消息`,i.supported?``:` · 浏览器不支持`]})]})}var u=`import * as React from "react";

import { useBroadcastChannel } from "../../../src";

function Case2() {
  const [channel, setChannel] = React.useState("B");
  const parse = (v: unknown) => String(v);
  const sender = useBroadcastChannel("hooks-channel-A", parse);
  const receiver = useBroadcastChannel("hooks-channel-" + channel, parse);
  return (
    <>
      <button onClick={() => setChannel((v) => (v === "A" ? "B" : "A"))}>
        切换接收频道
      </button>
      <button
        disabled={!sender.supported}
        onClick={() => sender.postMessage("来自 A 的消息")}
      >
        向 A 发送消息
      </button>
      <output>
        当前频道 {channel} · {receiver.message ?? "未收到消息"}
        {!sender.supported ? " · 浏览器不支持" : ""}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`结构化消息与解析`,description:`双连接演示对象消息，接收时验证字段后显示业务内容。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`不同频道互相隔离`,description:`发送方和接收方可使用不同频道，切换到同频道后再次发送才会收到。`,children:(0,o.jsx)(l,{})})]})}export{d as default};