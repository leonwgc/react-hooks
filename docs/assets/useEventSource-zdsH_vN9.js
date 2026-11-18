import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{r}from"./browser-DGxvnSgI.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i(),s=class extends EventTarget{readyState=0;constructor(){super(),queueMicrotask(()=>{this.readyState!==2&&(this.readyState=1,this.dispatchEvent(new Event(`open`)))})}close(){this.readyState=2}send(e,t){this.readyState===1&&this.dispatchEvent(new MessageEvent(e,{data:t}))}};function c(){let e=a.useRef(null),t=r(`/local-notice`,{event:`notice`,parse:e=>{let t=JSON.parse(e);if(!t||typeof t!=`object`||!(`title`in t)||typeof t.title!=`string`)throw Error(`缺少 title`);return t.title},factory:()=>{let t=new s;return e.current=t,t}});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>e.current?.send(`notice`,`{"title":"新通知"}`),children:`发送有效通知`}),(0,o.jsx)(`button`,{onClick:()=>e.current?.send(`notice`,`invalid`),children:`发送错误 JSON`}),(0,o.jsxs)(`output`,{children:[t.status,` · `,t.data??`等待通知`]}),!!t.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(t.error)})]})}var l=`import * as React from "react";

import { useEventSource, type EventSourceConnection } from "../../../src";

class LocalSource extends EventTarget implements EventSourceConnection {
  readyState = 0;
  constructor() {
    super();
    queueMicrotask(() => {
      if (this.readyState === 2) return;
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    });
  }
  close() {
    this.readyState = 2;
  }
  send(type: string, data: string) {
    if (this.readyState === 1)
      this.dispatchEvent(new MessageEvent(type, { data }));
  }
}

function Case1() {
  const source = React.useRef<LocalSource | null>(null);
  const events = useEventSource("/local-notice", {
    event: "notice",
    parse: (value) => {
      const data: unknown = JSON.parse(value);
      if (
        !data ||
        typeof data !== "object" ||
        !("title" in data) ||
        typeof data.title !== "string"
      )
        throw Error("缺少 title");
      return data.title;
    },
    factory: () => {
      const next = new LocalSource();
      source.current = next;
      return next;
    },
  });
  return (
    <>
      <button
        onClick={() => source.current?.send("notice", '{"title":"新通知"}')}
      >
        发送有效通知
      </button>
      <button onClick={() => source.current?.send("notice", "invalid")}>
        发送错误 JSON
      </button>
      <output>
        {events.status} · {events.data ?? "等待通知"}
      </output>
      {!!events.error && <p role="alert">{String(events.error)}</p>}
    </>
  );
}

export default Case1;
`,u=class extends EventTarget{readyState=0;constructor(){super(),queueMicrotask(()=>{this.readyState!==2&&(this.readyState=1,this.dispatchEvent(new Event(`open`)))})}close(){this.readyState=2}send(e,t){this.readyState===1&&this.dispatchEvent(new MessageEvent(e,{data:t}))}};function d(){let[e,t]=a.useState(!1),n=a.useRef(null),i=r(e?`/local-stream`:null,{parse:e=>e,factory:()=>{let e=new u;return n.current=e,e}});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`停用事件源`:`启用事件源`}),(0,o.jsx)(`button`,{onClick:i.close,children:`关闭 SSE 连接`}),(0,o.jsx)(`button`,{onClick:i.reconnect,children:`重连 SSE`}),(0,o.jsx)(`button`,{onClick:()=>n.current?.send(`message`,`本地推送`),children:`发送本地推送`}),(0,o.jsxs)(`output`,{children:[i.status,` · `,i.data??`暂无消息`]})]})}var f=`import * as React from "react";

import { useEventSource, type EventSourceConnection } from "../../../src";

class LocalSource extends EventTarget implements EventSourceConnection {
  readyState = 0;
  constructor() {
    super();
    queueMicrotask(() => {
      if (this.readyState === 2) return;
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    });
  }
  close() {
    this.readyState = 2;
  }
  send(type: string, data: string) {
    if (this.readyState === 1)
      this.dispatchEvent(new MessageEvent(type, { data }));
  }
}

function Case2() {
  const [enabled, setEnabled] = React.useState(false);
  const source = React.useRef<LocalSource | null>(null);
  const events = useEventSource(enabled ? "/local-stream" : null, {
    parse: (value) => value,
    factory: () => {
      const next = new LocalSource();
      source.current = next;
      return next;
    },
  });
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用事件源" : "启用事件源"}
      </button>
      <button onClick={events.close}>关闭 SSE 连接</button>
      <button onClick={events.reconnect}>重连 SSE</button>
      <button onClick={() => source.current?.send("message", "本地推送")}>
        发送本地推送
      </button>
      <output>
        {events.status} · {events.data ?? "暂无消息"}
      </output>
    </>
  );
}

export default Case2;
`;function p(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:l,title:`自定义事件与 JSON 解析`,description:`本地事件源模拟命名事件，发送正确或错误 JSON，观察解析结果与错误恢复。`,children:(0,o.jsx)(c,{})}),(0,o.jsx)(e,{source:f,title:`按需连接与重新连接`,description:`url 为 null 时不连接，启用后可以主动关闭和重连；事件源仅在本地运行。`,children:(0,o.jsx)(d,{})})]})}export{p as default};