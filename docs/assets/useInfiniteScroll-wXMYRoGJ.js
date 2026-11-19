import{t as e}from"./Scenario-qCntdwnE.js";import{t}from"./list-HCMrSYoz.js";import{t as n}from"./webHelpers-C9HRgI6m.js";import{D as r}from"./index--S_n-0Gu.js";var i=r();function a(){let e=t(async({cursor:e,signal:t})=>(await n(t,200),{items:[e===`start`?`第一页内容`:`第二页内容`],nextCursor:e===`start`?`next`:null}),{initialCursor:`start`,manual:!0});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{disabled:e.loading||!e.hasMore,onClick:()=>void e.loadMore().catch(()=>{}),children:`加载字符串游标下一页`}),(0,i.jsx)(`button`,{onClick:e.reset,children:`重置游标`}),(0,i.jsxs)(`output`,{children:[e.items.join(` / `)||`等待加载`,` ·`,` `,e.hasMore?`还有下一页`:`已到末尾`]})]})}var o=`import { useInfiniteScroll } from "../../../src";

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
`;function s(){let e=t(async({cursor:e,signal:t})=>(await n(t,200),{items:[{id:e,text:`历史 ${e}`},{id:99,text:`共享消息`}],nextCursor:e>1?e-1:null}),{initialCursor:3,manual:!0,direction:`prepend`,getKey:e=>e.id});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{disabled:e.loading||!e.hasMore,onClick:()=>void e.loadMore().catch(()=>{}),children:`加载更早历史`}),(0,i.jsx)(`button`,{onClick:e.cancel,children:`取消历史请求`}),(0,i.jsx)(`ol`,{children:e.items.map(e=>(0,i.jsx)(`li`,{children:e.text},e.id))}),(0,i.jsxs)(`output`,{children:[`去重后 `,e.items.length,` 条`]})]})}var c=`import { useInfiniteScroll } from "../../../src";

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
`;function l(){return(0,i.jsxs)(`div`,{className:`additional-demos`,children:[(0,i.jsx)(e,{source:o,title:`字符串游标与手动加载`,description:`使用字符串令牌作为 Cursor，手动逐页加载，null 表示已到末尾。`,children:(0,i.jsx)(a,{})}),(0,i.jsx)(e,{source:c,title:`前插历史与重复项去重`,description:`每页含一个重复记录，按 id 去重，并把旧消息插入前方。`,children:(0,i.jsx)(s,{})})]})}export{l as default};