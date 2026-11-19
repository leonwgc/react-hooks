import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./effects-Kb5q3qQz.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(``),[n,i]=a.useState(300),s=r(e,n);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`预览内容`,(0,o.jsx)(`input`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsxs)(`label`,{children:[`等待毫秒`,(0,o.jsxs)(`select`,{value:n,onChange:e=>i(Number(e.target.value)),children:[(0,o.jsx)(`option`,{value:0,children:`0`}),(0,o.jsx)(`option`,{value:300,children:`300`}),(0,o.jsx)(`option`,{value:1e3,children:`1000`})]})]}),(0,o.jsxs)(`output`,{children:[`即时：`,e,` / 稳定：`,s]})]})}var c=`import * as React from "react";

import { useDebounce } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("");
  const [wait, setWait] = React.useState(300);
  const value = useDebounce(text, wait);
  return (
    <>
      <label>
        预览内容
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        等待毫秒
        <select value={wait} onChange={(e) => setWait(Number(e.target.value))}>
          <option value={0}>0</option>
          <option value={300}>300</option>
          <option value={1000}>1000</option>
        </select>
      </label>
      <output>
        即时：{text} / 稳定：{value}
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState({keyword:``,limit:10}),n=r(e,400);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`对象关键词`,(0,o.jsx)(`input`,{value:e.keyword,onChange:e=>t(t=>({...t,keyword:e.target.value}))})]}),(0,o.jsx)(`button`,{onClick:()=>t(e=>({...e,limit:e.limit===10?20:10})),children:`切换 10 / 20 条`}),(0,o.jsxs)(`output`,{children:[`待查询条件：`,JSON.stringify(n)]})]})}var u=`import * as React from "react";

import { useDebounce } from "../../../src";

function Case2() {
  const [filters, setFilters] = React.useState({ keyword: "", limit: 10 });
  const value = useDebounce(filters, 400);
  return (
    <>
      <label>
        对象关键词
        <input
          value={filters.keyword}
          onChange={(e) =>
            setFilters((s) => ({ ...s, keyword: e.target.value }))
          }
        />
      </label>
      <button
        onClick={() =>
          setFilters((s) => ({ ...s, limit: s.limit === 10 ? 20 : 10 }))
        }
      >
        切换 10 / 20 条
      </button>
      <output>待查询条件：{JSON.stringify(value)}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`可调整等待时间`,description:`修改等待时间并连续输入，比较即时值与防抖值。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`对象条件合并查询`,description:`多个条件组成同一个对象，停止修改后一起成为查询快照。`,children:(0,o.jsx)(l,{})})]})}export{d as default};