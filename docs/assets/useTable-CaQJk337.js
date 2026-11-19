import{t as e}from"./Scenario-lI9aBaLE.js";import{a as t}from"./data-Cyz50yx1.js";import{t as n}from"./webHelpers-C9HRgI6m.js";import{D as r}from"./index-BH-UjxLV.js";import{r as i,t as a}from"./react-DvXU6kJ2.js";var o=r();function s(){let e=t(async({signal:e},t)=>(await n(e,150),{records:Array.from({length:t.pageSize},(e,n)=>({id:(t.page-1)*t.pageSize+n+1})),count:30}),{initialFilters:{},pageSize:5,select:e=>({list:e.records,total:e.count})});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>e.setPage(e.page+1),children:`查询响应适配下一页`}),(0,o.jsx)(`button`,{onClick:()=>e.setPageSize(10),children:`切换每页十条`}),(0,o.jsxs)(`output`,{children:[`第 `,e.page,` 页 · 总数 `,e.total,` · `,e.loading?`加载中`:`已加载`]}),(0,o.jsx)(`ul`,{children:e.list.map(e=>(0,o.jsxs)(`li`,{children:[`记录 `,e.id]},e.id))}),!!e.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(e.error)})]})}var c=`import { useTable } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const t = useTable(
    async ({ signal }, query) => {
      await delay(signal, 150);
      return {
        records: Array.from({ length: query.pageSize }, (_, i) => ({
          id: (query.page - 1) * query.pageSize + i + 1,
        })),
        count: 30,
      };
    },
    {
      initialFilters: {},
      pageSize: 5,
      select: (response) => ({ list: response.records, total: response.count }),
    },
  );
  return (
    <>
      <button onClick={() => t.setPage(t.page + 1)}>查询响应适配下一页</button>
      <button onClick={() => t.setPageSize(10)}>切换每页十条</button>
      <output>
        第 {t.page} 页 · 总数 {t.total} · {t.loading ? "加载中" : "已加载"}
      </output>
      <ul>
        {t.list.map((item) => (
          <li key={item.id}>记录 {item.id}</li>
        ))}
      </ul>
      {!!t.error && <p role="alert">{String(t.error)}</p>}
    </>
  );
}

export default Case1;
`,l=i(a(),1);function u(){let[e,r]=l.useState(!0),i=t(async({signal:t})=>{if(await n(t,150),e)throw Error(`列表服务暂时不可用`);return{list:[{id:1,title:`恢复后的记录`}],total:1}},{initialFilters:{keyword:``},select:e=>e});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>r(e=>!e),children:e?`关闭失败模拟`:`启用失败模拟`}),(0,o.jsx)(`button`,{onClick:i.refresh,children:`刷新当前表格`}),(0,o.jsx)(`button`,{onClick:i.search.reset,children:`重置表格查询`}),(0,o.jsx)(`output`,{children:i.loading?`表格加载中`:`已加载 ${i.list.length} 条`}),!!i.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(i.error)}),(0,o.jsx)(`ul`,{children:i.list.map(e=>(0,o.jsx)(`li`,{children:e.title},e.id))})]})}var d=`import * as React from "react";

import { useTable } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const [fail, setFail] = React.useState(true);
  const t = useTable(
    async ({ signal }) => {
      await delay(signal, 150);
      if (fail) throw Error("列表服务暂时不可用");
      return { list: [{ id: 1, title: "恢复后的记录" }], total: 1 };
    },
    { initialFilters: { keyword: "" }, select: (response) => response },
  );
  return (
    <>
      <button onClick={() => setFail((v) => !v)}>
        {fail ? "关闭失败模拟" : "启用失败模拟"}
      </button>
      <button onClick={t.refresh}>刷新当前表格</button>
      <button onClick={t.search.reset}>重置表格查询</button>
      <output>{t.loading ? "表格加载中" : \`已加载 \${t.list.length} 条\`}</output>
      {!!t.error && <p role="alert">{String(t.error)}</p>}
      <ul>
        {t.list.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
`;function f(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`适配不同服务响应`,description:`select 把 records/count 转为 list/total；分页变化会重新调用本地模拟服务。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:d,title:`请求失败与刷新恢复`,description:`演示服务失败后保留页面控制，关闭失败模拟后 refresh 重新获取当前查询。`,children:(0,o.jsx)(u,{})})]})}export{f as default};