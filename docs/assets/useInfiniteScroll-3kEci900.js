import{t as e}from"./Scenario-lI9aBaLE.js";import{t}from"./list-DyDhq8B8.js";import{t as n}from"./webHelpers-C9HRgI6m.js";import{D as r}from"./index-BH-UjxLV.js";import{r as i,t as a}from"./react-DvXU6kJ2.js";var o=r();function s(){let e=t(async({cursor:e,signal:t})=>(await n(t,200),{items:[e===`start`?`第一页内容`:`第二页内容`],nextCursor:e===`start`?`next`:null}),{initialCursor:`start`,manual:!0});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:e.loading||!e.hasMore,onClick:()=>void e.loadMore().catch(()=>{}),children:`加载字符串游标下一页`}),(0,o.jsx)(`button`,{onClick:e.reset,children:`重置游标`}),(0,o.jsxs)(`output`,{children:[e.items.join(` / `)||`等待加载`,` ·`,` `,e.hasMore?`还有下一页`:`已到末尾`]})]})}var c=`import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const feed = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: [cursor === "start" ? "第一页内容" : "第二页内容"],
        nextCursor: cursor === "start" ? "next" : null,
      };
    },
    { initialCursor: "start", manual: true },
  );
  return (
    <>
      <button
        disabled={feed.loading || !feed.hasMore}
        onClick={() => void feed.loadMore().catch(() => {})}
      >
        加载字符串游标下一页
      </button>
      <button onClick={feed.reset}>重置游标</button>
      <output>
        {feed.items.join(" / ") || "等待加载"} ·{" "}
        {feed.hasMore ? "还有下一页" : "已到末尾"}
      </output>
    </>
  );
}

export default Case1;
`;function l(){let e=t(async({cursor:e,signal:t})=>(await n(t,200),{items:[{id:e,text:`历史 ${e}`},{id:99,text:`共享消息`}],nextCursor:e>1?e-1:null}),{initialCursor:3,manual:!0,direction:`prepend`,getKey:e=>e.id});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:e.loading||!e.hasMore,onClick:()=>void e.loadMore().catch(()=>{}),children:`加载更早历史`}),(0,o.jsx)(`button`,{onClick:e.cancel,children:`取消历史请求`}),(0,o.jsx)(`ol`,{children:e.items.map(e=>(0,o.jsx)(`li`,{children:e.text},e.id))}),(0,o.jsxs)(`output`,{children:[`去重后 `,e.items.length,` 条`]})]})}var u=`import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const feed = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: [
          { id: cursor, text: \`历史 \${cursor}\` },
          { id: 99, text: "共享消息" },
        ],
        nextCursor: cursor > 1 ? cursor - 1 : null,
      };
    },
    {
      initialCursor: 3,
      manual: true,
      direction: "prepend",
      getKey: (item) => item.id,
    },
  );
  return (
    <>
      <button
        disabled={feed.loading || !feed.hasMore}
        onClick={() => void feed.loadMore().catch(() => {})}
      >
        加载更早历史
      </button>
      <button onClick={feed.cancel}>取消历史请求</button>
      <ol>
        {feed.items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
      <output>去重后 {feed.items.length} 条</output>
    </>
  );
}

export default Case2;
`,d=i(a(),1),f={first:{items:[`最新 1`,`最新 2`],nextCursor:`token-a`},"token-a":{items:[`较早 3`,`较早 4`],nextCursor:`token-b`},"token-b":{items:[`最早 5`],nextCursor:null}};function p(){let[e,r]=d.useState([]),i=t(async({signal:e,cursor:t})=>(r(e=>[...e,t??`null`]),await n(e,200),f[t??`first`]),{initialCursor:null});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:!i.hasMore||i.loading,onClick:()=>void i.loadMore(),children:i.hasMore?`加载下一页`:`已全部加载`}),(0,o.jsx)(`button`,{className:`secondary`,onClick:i.reset,children:`重新加载`}),(0,o.jsx)(`ul`,{children:i.items.map(e=>(0,o.jsx)(`li`,{children:e},e))}),(0,o.jsxs)(`output`,{children:[`请求游标：`,e.join(` → `)||`无`]})]})}var m=`import * as React from "react";

import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

// The first request has no cursor, so the cursor type includes null.
const pages: Record<string, { items: string[]; nextCursor: string | null }> = {
  first: { items: ["最新 1", "最新 2"], nextCursor: "token-a" },
  "token-a": { items: ["较早 3", "较早 4"], nextCursor: "token-b" },
  "token-b": { items: ["最早 5"], nextCursor: null },
};

function Feature1() {
  const [cursors, setCursors] = React.useState<string[]>([]);
  const feed = useInfiniteScroll<string, string | null>(
    async ({ signal, cursor }) => {
      setCursors((list) => [...list, cursor ?? "null"]);
      await delay(signal, 200);
      return pages[cursor ?? "first"]!;
    },
    { initialCursor: null },
  );
  return (
    <>
      <button
        disabled={!feed.hasMore || feed.loading}
        onClick={() => void feed.loadMore()}
      >
        {feed.hasMore ? "加载下一页" : "已全部加载"}
      </button>
      <button className="secondary" onClick={feed.reset}>
        重新加载
      </button>
      <ul>
        {feed.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <output>请求游标：{cursors.join(" → ") || "无"}</output>
    </>
  );
}

export default Feature1;
`;function h(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`字符串游标与手动加载`,description:`使用字符串令牌作为 Cursor，手动逐页加载，null 表示已到末尾。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`前插历史与重复项去重`,description:`每页含一个重复记录，按 id 去重，并把旧消息插入前方。`,children:(0,o.jsx)(l,{})}),(0,o.jsx)(e,{source:m,title:`以 null 作为首页游标`,description:`首页请求不带游标，initialCursor 为 null；之后使用服务端返回的令牌，nextCursor 为 null 时结束。`,children:(0,o.jsx)(p,{})})]})}export{h as default};