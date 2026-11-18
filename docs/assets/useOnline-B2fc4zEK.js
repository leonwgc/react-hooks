import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,u as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=r();function s(){let e=i(),[t,n]=a.useState(``),[r,s]=a.useState(`尚未提交`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`离线草稿`,(0,o.jsx)(`input`,{value:t,onChange:e=>n(e.target.value)})]}),(0,o.jsx)(`button`,{disabled:!e,onClick:()=>s(t||`空草稿`),children:`模拟提交草稿`}),(0,o.jsxs)(`output`,{children:[e?`允许提交`:`离线，草稿仍可编辑`,` · `,r]})]})}var c=`import * as React from "react";

import { useOnline } from "../../../src";

function Case1() {
  const online = useOnline();
  const [draft, setDraft] = React.useState("");
  const [saved, setSaved] = React.useState("尚未提交");
  return (
    <>
      <label>
        离线草稿
        <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button disabled={!online} onClick={() => setSaved(draft || "空草稿")}>
        模拟提交草稿
      </button>
      <output>
        {online ? "允许提交" : "离线，草稿仍可编辑"} · {saved}
      </output>
    </>
  );
}

export default Case1;
`;function l(){let e=i(),[t,n]=a.useState(`尚未读取`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(e?`在线分支：最新演示数据`:`离线分支：本地缓存数据`),children:`按网络状态读取`}),(0,o.jsx)(`output`,{children:t}),(0,o.jsx)(`p`,{children:`切换 Offline 后再次读取，观察缓存分支。`})]})}var u=`import * as React from "react";

import { useOnline } from "../../../src";

function Case2() {
  const online = useOnline();
  const [result, setResult] = React.useState("尚未读取");
  return (
    <>
      <button
        onClick={() =>
          setResult(
            online ? "在线分支：最新演示数据" : "离线分支：本地缓存数据",
          )
        }
      >
        按网络状态读取
      </button>
      <output>{result}</output>
      <p>切换 Offline 后再次读取，观察缓存分支。</p>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`离线草稿与提交入口`,description:`输入始终可用，离线时保留草稿并禁用模拟提交；可用浏览器开发工具切换 Offline。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`缓存回退策略`,description:`点击读取时根据真实网络状态选择演示数据源，不发送外部请求。`,children:(0,o.jsx)(l,{})})]})}export{d as default};