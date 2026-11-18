import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r,t as i}from"./query-BMgV9rD5.js";import{t as a}from"./webHelpers-C9HRgI6m.js";import{D as o}from"./index-DcZxIQAI.js";var s=t(n(),1),c=o();function l(){let[e]=s.useState(()=>{let e=0;return i(async({signal:t},n)=>(await a(t,100),`${n} / 请求 ${++e}`),{staleTime:1/0})}),[t,n]=s.useState(`A`),o=r(e,t);return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{onClick:()=>n(`A`),children:`查看缓存 A`}),(0,c.jsx)(`button`,{onClick:()=>n(`B`),children:`查看缓存 B`}),(0,c.jsx)(`button`,{onClick:()=>n(null),children:`停止查询订阅`}),(0,c.jsx)(`output`,{children:o.data??o.status})]})}var u=`import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [store] = React.useState(() => {
    let calls = 0;
    return createQueryStore(
      async ({ signal }, key: string) => {
        await delay(signal, 100);
        return \`\${key} / 请求 \${++calls}\`;
      },
      { staleTime: Infinity },
    );
  });
  const [key, setKey] = React.useState<string | null>("A");
  const q = useQuery(store, key);
  return (
    <>
      <button onClick={() => setKey("A")}>查看缓存 A</button>
      <button onClick={() => setKey("B")}>查看缓存 B</button>
      <button onClick={() => setKey(null)}>停止查询订阅</button>
      <output>{q.data ?? q.status}</output>
    </>
  );
}

export default Case1;
`;function d(){let e=s.useRef(!0),[t]=s.useState(()=>i(async({signal:t})=>{if(await a(t,300),e.current)throw Error(`模拟缓存请求失败`);return`查询已恢复`})),n=r(t,`manual`,{enabled:!1});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{onClick:()=>void n.refetch().catch(()=>{}),children:`手动获取缓存数据`}),(0,c.jsx)(`button`,{onClick:()=>{e.current=!1,n.refetch().catch(()=>{})},children:`关闭失败并重试`}),(0,c.jsx)(`button`,{onClick:n.cancel,children:`取消共享请求`}),(0,c.jsx)(`output`,{children:n.data??n.status}),!!n.error&&(0,c.jsx)(`p`,{role:`alert`,children:String(n.error)})]})}var f=`import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const fail = React.useRef(true);
  const [store] = React.useState(() =>
    createQueryStore(async ({ signal }) => {
      await delay(signal, 300);
      if (fail.current) throw Error("模拟缓存请求失败");
      return "查询已恢复";
    }),
  );
  const q = useQuery(store, "manual", { enabled: false });
  return (
    <>
      <button onClick={() => void q.refetch().catch(() => {})}>
        手动获取缓存数据
      </button>
      <button
        onClick={() => {
          fail.current = false;
          void q.refetch().catch(() => {});
        }}
      >
        关闭失败并重试
      </button>
      <button onClick={q.cancel}>取消共享请求</button>
      <output>{q.data ?? q.status}</output>
      {!!q.error && <p role="alert">{String(q.error)}</p>}
    </>
  );
}

export default Case2;
`;function p(){let[e,t]=s.useState(1),[n]=s.useState(()=>i(async({signal:e},[,t])=>(await a(e,600),`第 ${t.page} 页数据`),{staleTime:1/0})),o=r(n,[`articles`,{page:e}],{keepPreviousData:!0});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{disabled:o.isFetching,onClick:()=>t(e=>e+1),children:`查询下一页`}),(0,c.jsx)(`button`,{onClick:()=>n.invalidate([`articles`],{exact:!1}),children:`刷新文章前缀`}),(0,c.jsxs)(`output`,{children:[o.data??`首次加载`,` ·`,` `,o.isPreviousData?`保留前页`:o.isFetching?`刷新中`:`当前页`]})]})}var m=`import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [page, setPage] = React.useState(1);
  const [store] = React.useState(() =>
    createQueryStore<string, readonly ["articles", { page: number }]>(
      async ({ signal }, [, params]) => {
        await delay(signal, 600);
        return \`第 \${params.page} 页数据\`;
      },
      { staleTime: Infinity },
    ),
  );
  const q = useQuery(store, ["articles", { page }], { keepPreviousData: true });
  return (
    <>
      <button disabled={q.isFetching} onClick={() => setPage((p) => p + 1)}>
        查询下一页
      </button>
      <button onClick={() => store.invalidate(["articles"], { exact: false })}>
        刷新文章前缀
      </button>
      <output>
        {q.data ?? "首次加载"} ·{" "}
        {q.isPreviousData ? "保留前页" : q.isFetching ? "刷新中" : "当前页"}
      </output>
    </>
  );
}

export default Enhanced1;
`,h=e=>e.count,g=s.memo(function({store:e}){let t=s.useRef(0);t.current++;let n=r(e,`stats`,{enabled:!1,select:h,notifyOnChangeProps:[`data`]});return(0,c.jsxs)(`output`,{children:[`计数 `,n.data??0,` · 渲染 `,t.current]})});function _(){let[e]=s.useState(()=>{let e=i(async()=>({count:0,note:`初始`}));return e.setData(`stats`,{count:0,note:`初始`}),e}),t=r(e,`stats`,{enabled:!1});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{onClick:()=>t.setData(e=>({count:e?.count??0,note:`备注 ${Date.now()}`})),children:`仅修改备注`}),(0,c.jsx)(`button`,{onClick:()=>t.setData(e=>({count:(e?.count??0)+1,note:e?.note??``})),children:`增加订阅计数`}),(0,c.jsx)(g,{store:e}),(0,c.jsx)(`p`,{children:t.data?.note})]})}var v=`import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

const countSelector = (value: { count: number; note: string }) => value.count;

const SelectedCount = React.memo(function SelectedCount({
  store,
}: {
  store: ReturnType<typeof createQueryStore<{ count: number; note: string }>>;
}) {
  const renders = React.useRef(0);
  renders.current++;
  const q = useQuery(store, "stats", {
    enabled: false,
    select: countSelector,
    notifyOnChangeProps: ["data"],
  });
  return (
    <output>
      计数 {q.data ?? 0} · 渲染 {renders.current}
    </output>
  );
});

function Enhanced2() {
  const [store] = React.useState(() => {
    const s = createQueryStore(async () => ({ count: 0, note: "初始" }));
    s.setData("stats", { count: 0, note: "初始" });
    return s;
  });
  const q = useQuery(store, "stats", { enabled: false });
  return (
    <>
      <button
        onClick={() =>
          q.setData((p) => ({
            count: p?.count ?? 0,
            note: \`备注 \${Date.now()}\`,
          }))
        }
      >
        仅修改备注
      </button>
      <button
        onClick={() =>
          q.setData((p) => ({
            count: (p?.count ?? 0) + 1,
            note: p?.note ?? "",
          }))
        }
      >
        增加订阅计数
      </button>
      <SelectedCount store={store} />
      <p>{q.data?.note}</p>
    </>
  );
}

export default Enhanced2;
`;function y(){return(0,c.jsxs)(`div`,{className:`additional-demos`,children:[(0,c.jsx)(e,{source:u,title:`缓存键切换与复用`,description:`A、B 使用不同缓存项，再次切回 A 会复用新鲜数据；null 暂停订阅。`,children:(0,c.jsx)(l,{})}),(0,c.jsx)(e,{source:f,title:`手动查询与错误恢复`,description:`enabled 为 false 时不自动请求；失败后显式重试，并可取消正在进行的请求。`,children:(0,c.jsx)(d,{})}),(0,c.jsx)(e,{source:m,title:`结构键与分页保留`,description:`用数组和对象描述缓存键，切页时保留前页数据，并可按 articles 前缀刷新全部已有页。`,children:(0,c.jsx)(p,{})}),(0,c.jsx)(e,{source:v,title:`选择数据与隔离订阅`,description:`两个订阅者共用缓存，计数组件只订阅 count；修改备注不会重绘该组件。`,children:(0,c.jsx)(_,{})})]})}export{y as default};