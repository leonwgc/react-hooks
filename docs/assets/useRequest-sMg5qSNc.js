import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./data-tRW6rqDA.js";import{t as i}from"./webHelpers-C9HRgI6m.js";import{D as a}from"./index-DcZxIQAI.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(!1),n=o.useRef(0),a=r(async({signal:e},t)=>(await i(e,150),`${t}：第 ${++n.current} 次更新`),{manual:!1,defaultParams:[`通知`],pollingInterval:e?1e3:void 0});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>t(!0),children:`启动通知轮询`}),(0,s.jsx)(`button`,{onClick:()=>{t(!1),a.cancel()},children:`停止通知轮询`}),(0,s.jsx)(`button`,{onClick:a.refresh,children:`手动刷新通知`}),(0,s.jsx)(`output`,{children:a.loading?`更新中`:a.data??`等待自动请求`}),!!a.error&&(0,s.jsx)(`p`,{role:`alert`,children:String(a.error)})]})}var l=`import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [polling, setPolling] = React.useState(false);
  const count = React.useRef(0);
  const r = useRequest(
    async ({ signal }, name: string) => {
      await delay(signal, 150);
      return \`\${name}：第 \${++count.current} 次更新\`;
    },
    {
      manual: false,
      defaultParams: ["通知"],
      pollingInterval: polling ? 1000 : undefined,
    },
  );
  return (
    <>
      <button onClick={() => setPolling(true)}>启动通知轮询</button>
      <button
        onClick={() => {
          setPolling(false);
          r.cancel();
        }}
      >
        停止通知轮询
      </button>
      <button onClick={r.refresh}>手动刷新通知</button>
      <output>{r.loading ? "更新中" : (r.data ?? "等待自动请求")}</output>
      {!!r.error && <p role="alert">{String(r.error)}</p>}
    </>
  );
}

export default Case1;
`;function u(){let e=r(async({signal:e},t,n)=>(await i(e,n),t));return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>e.run(`较慢旧结果`,900),children:`发送慢请求`}),(0,s.jsx)(`button`,{onClick:()=>e.run(`较快新结果`,100),children:`发送快请求`}),(0,s.jsx)(`button`,{onClick:()=>e.mutate(`本地修订结果`),children:`本地更新结果`}),(0,s.jsx)(`button`,{onClick:e.cancel,children:`取消竞争请求`}),(0,s.jsx)(`output`,{children:e.loading?`请求中`:e.data??`暂无数据`})]})}var d=`import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const r = useRequest(async ({ signal }, name: string, ms: number) => {
    await delay(signal, ms);
    return name;
  });
  return (
    <>
      <button onClick={() => r.run("较慢旧结果", 900)}>发送慢请求</button>
      <button onClick={() => r.run("较快新结果", 100)}>发送快请求</button>
      <button onClick={() => r.mutate("本地修订结果")}>本地更新结果</button>
      <button onClick={r.cancel}>取消竞争请求</button>
      <output>{r.loading ? "请求中" : (r.data ?? "暂无数据")}</output>
    </>
  );
}

export default Case2;
`;function f(){let[e,t]=o.useState(!1),[n,a]=o.useState(1),c=r(async({signal:e},t)=>(await i(e,400),`第 ${t} 页`),{manual:!1,defaultParams:[n],ready:e,refreshDeps:[n]});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`label`,{className:`check`,children:[(0,s.jsx)(`input`,{type:`checkbox`,checked:e,onChange:e=>t(e.target.checked)}),`允许请求`]}),(0,s.jsx)(`button`,{onClick:()=>a(e=>e+1),children:`下一页条件`}),(0,s.jsxs)(`output`,{children:[`页码 `,n,` · `,c.fetching?`请求中`:c.data??`等待就绪`]})]})}var p=`import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [ready, setReady] = React.useState(false),
    [page, setPage] = React.useState(1);
  const r = useRequest(
    async ({ signal }, page: number) => {
      await delay(signal, 400);
      return \`第 \${page} 页\`;
    },
    { manual: false, defaultParams: [page], ready, refreshDeps: [page] },
  );
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={ready}
          onChange={(e) => setReady(e.target.checked)}
        />
        允许请求
      </label>
      <button onClick={() => setPage((p) => p + 1)}>下一页条件</button>
      <output>
        页码 {page} · {r.fetching ? "请求中" : (r.data ?? "等待就绪")}
      </output>
    </>
  );
}

export default Enhanced1;
`;function m(){let[e,t]=o.useState([]),n=r(async({signal:e},t)=>(await i(e,t),`${t}ms 请求完成`),{loadingDelay:300,onBefore:()=>t(e=>[...e,`开始`]),onFinally:()=>t(e=>[...e,`完成`])});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>n.run(50),children:`快速请求 50ms`}),(0,s.jsx)(`button`,{onClick:()=>n.run(900),children:`慢速请求 900ms`}),(0,s.jsx)(`button`,{onClick:n.cancel,children:`取消延迟请求`}),(0,s.jsxs)(`output`,{children:[`fetching: `,String(n.fetching),` · loading: `,String(n.loading),` · `,n.data]}),(0,s.jsx)(`p`,{children:e.join(` → `)})]})}var h=`import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const r = useRequest(
    async ({ signal }, ms: number) => {
      await delay(signal, ms);
      return \`\${ms}ms 请求完成\`;
    },
    {
      loadingDelay: 300,
      onBefore: () => setEvents((x) => [...x, "开始"]),
      onFinally: () => setEvents((x) => [...x, "完成"]),
    },
  );
  return (
    <>
      <button onClick={() => r.run(50)}>快速请求 50ms</button>
      <button onClick={() => r.run(900)}>慢速请求 900ms</button>
      <button onClick={r.cancel}>取消延迟请求</button>
      <output>
        fetching: {String(r.fetching)} · loading: {String(r.loading)} · {r.data}
      </output>
      <p>{events.join(" → ")}</p>
    </>
  );
}

export default Enhanced2;
`;function g(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`自动请求与轮询控制`,description:`展开时按默认参数请求，启动轮询后定期刷新，停止会取消本轮并暂停后续轮询。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`竞争请求与本地修改`,description:`慢请求和快请求连续发出时只保留最新结果，mutate 可直接更新当前展示数据。`,children:(0,s.jsx)(u,{})}),(0,s.jsx)(e,{source:p,title:`就绪条件与依赖刷新`,description:`启用查询后自动加载；切换页码通过 refreshDeps 请求，关闭就绪条件会取消当前请求。`,children:(0,s.jsx)(f,{})}),(0,s.jsx)(e,{source:h,title:`延迟加载与生命周期`,description:`快请求不闪烁 loading；慢请求延迟显示加载，取消不触发 onFinally。`,children:(0,s.jsx)(m,{})})]})}export{g as default};