import{t as e}from"./Scenario-qCntdwnE.js";import{t}from"./data-Dj72mn0-.js";import{D as n}from"./index--S_n-0Gu.js";import{r,t as i}from"./react-DvXU6kJ2.js";var a=n();function o(){let e=t({initialPageSize:5});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:e.previous,children:`未知总数上一页`}),(0,a.jsx)(`button`,{onClick:e.next,children:`未知总数下一页`}),(0,a.jsx)(`button`,{onClick:e.reset,children:`回到第一页`}),(0,a.jsxs)(`output`,{children:[`第 `,e.page,` 页 · 总页数 `,e.pageCount??`未知`]})]})}var s=`import { usePagination } from "../../../src";

function Case1() {
  const p = usePagination({ initialPageSize: 5 });
  return (
    <>
      <button onClick={p.previous}>未知总数上一页</button>
      <button onClick={p.next}>未知总数下一页</button>
      <button onClick={p.reset}>回到第一页</button>
      <output>
        第 {p.page} 页 · 总页数 {p.pageCount ?? "未知"}
      </output>
    </>
  );
}

export default Case1;
`,c=r(i(),1);function l(){let[e,n]=c.useState(42),r=t({total:e,initialPageSize:10});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>r.setPage(999),children:`尝试跳到 999 页`}),(0,a.jsx)(`button`,{onClick:()=>n(12),children:`总数减为 12`}),(0,a.jsx)(`button`,{onClick:()=>n(0),children:`清空所有记录`}),(0,a.jsxs)(`output`,{children:[`第 `,r.page,` / `,r.pageCount,` 页 · 共 `,e,` 条`]})]})}var u=`import * as React from "react";

import { usePagination } from "../../../src";

function Case2() {
  const [total, setTotal] = React.useState(42);
  const p = usePagination({ total, initialPageSize: 10 });
  return (
    <>
      <button onClick={() => p.setPage(999)}>尝试跳到 999 页</button>
      <button onClick={() => setTotal(12)}>总数减为 12</button>
      <button onClick={() => setTotal(0)}>清空所有记录</button>
      <output>
        第 {p.page} / {p.pageCount} 页 · 共 {total} 条
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`未知总数分页`,description:`不传 total，页数为未知，由服务或调用者决定是否还有下一页。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:u,title:`总数减少与越界修正`,description:`先跳到最后一页，再减少总数或清空数据，观察页码限制。`,children:(0,a.jsx)(l,{})})]})}export{d as default};