import{t as e}from"./Scenario-qCntdwnE.js";import{i as t}from"./data-Dj72mn0-.js";import{D as n}from"./index--S_n-0Gu.js";import{r,t as i}from"./react-DvXU6kJ2.js";var a=n();function o(){let e=t([1,2,3]);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`div`,{className:`demo-row`,children:[1,2,3].map(t=>(0,a.jsxs)(`button`,{"aria-pressed":e.isSelected(t),onClick:()=>e.toggle(t),children:[`项目 `,t,e.isSelected(t)?` ✓`:``]},t))}),(0,a.jsx)(`button`,{onClick:e.selectAll,children:`选择全部项目`}),(0,a.jsx)(`button`,{onClick:e.clear,children:`清空项目选择`}),(0,a.jsxs)(`output`,{children:[`半选 `,String(e.partiallySelected),` · 全选 `,String(e.allSelected),` · 已选`,` `,e.selectedKeys.join(`,`)||`无`]})]})}var s=`import { useSelection } from "../../../src";

function Case1() {
  const s = useSelection<number>([1, 2, 3]);
  return (
    <>
      <div className="demo-row">
        {[1, 2, 3].map((key) => (
          <button
            key={key}
            aria-pressed={s.isSelected(key)}
            onClick={() => s.toggle(key)}
          >
            项目 {key}
            {s.isSelected(key) ? " ✓" : ""}
          </button>
        ))}
      </div>
      <button onClick={s.selectAll}>选择全部项目</button>
      <button onClick={s.clear}>清空项目选择</button>
      <output>
        半选 {String(s.partiallySelected)} · 全选 {String(s.allSelected)} · 已选{" "}
        {s.selectedKeys.join(",") || "无"}
      </output>
    </>
  );
}

export default Case1;
`,c=r(i(),1);function l(){let[e,n]=c.useState(`全部`),r=t([`A`,`B`],{preserve:!0,resetKey:e});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>r.toggle(`A`),children:`切换选择 A`}),(0,a.jsx)(`button`,{onClick:()=>r.toggle(`B`),children:`切换选择 B`}),(0,a.jsx)(`button`,{onClick:()=>n(e=>e===`全部`?`收藏`:`全部`),children:`切换查询范围`}),(0,a.jsxs)(`output`,{children:[`查询 `,e,` · 已选 `,r.selectedKeys.join(`,`)||`无`]})]})}var u=`import * as React from "react";

import { useSelection } from "../../../src";

function Case2() {
  const [query, setQuery] = React.useState("全部");
  const s = useSelection(["A", "B"], { preserve: true, resetKey: query });
  return (
    <>
      <button onClick={() => s.toggle("A")}>切换选择 A</button>
      <button onClick={() => s.toggle("B")}>切换选择 B</button>
      <button onClick={() => setQuery((v) => (v === "全部" ? "收藏" : "全部"))}>
        切换查询范围
      </button>
      <output>
        查询 {query} · 已选 {s.selectedKeys.join(",") || "无"}
      </output>
    </>
  );
}

export default Case2;
`;function d(){let e=[`A`,`B`,`C`,`D`,`E`],n=t(e,{disabledKeys:[`C`]});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`div`,{className:`demo-row`,children:e.map(e=>(0,a.jsx)(`button`,{disabled:n.isDisabled(e),"aria-pressed":n.isSelected(e),onClick:t=>n.toggle(e,{range:t.shiftKey}),children:e},e))}),(0,a.jsx)(`button`,{onClick:()=>n.selectRange(`A`,`E`),children:`选择 A 到 E`}),(0,a.jsx)(`button`,{onClick:n.clear,children:`清空范围选择`}),(0,a.jsxs)(`output`,{children:[`已选 `,n.selectedKeys.join(`,`)||`无`]})]})}var f=`import { useSelection } from "../../../src";

function Enhanced1() {
  const keys = ["A", "B", "C", "D", "E"],
    s = useSelection(keys, { disabledKeys: ["C"] });
  return (
    <>
      <div className="demo-row">
        {keys.map((key) => (
          <button
            key={key}
            disabled={s.isDisabled(key)}
            aria-pressed={s.isSelected(key)}
            onClick={(e) => s.toggle(key, { range: e.shiftKey })}
          >
            {key}
          </button>
        ))}
      </div>
      <button onClick={() => s.selectRange("A", "E")}>选择 A 到 E</button>
      <button onClick={s.clear}>清空范围选择</button>
      <output>已选 {s.selectedKeys.join(",") || "无"}</output>
    </>
  );
}

export default Enhanced1;
`;function p(){let[e,n]=c.useState(2),[r,i]=c.useState(!1),o=t([`A`,`B`,`C`,`D`],{maxSelected:e,disabledKeys:r?[`A`]:[]});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(`label`,{children:[`最多选择`,(0,a.jsx)(`select`,{value:e,onChange:e=>n(Number(e.target.value)),children:[0,1,2,4].map(e=>(0,a.jsx)(`option`,{children:e},e))})]}),(0,a.jsx)(`button`,{onClick:o.selectAll,children:`按上限全选`}),(0,a.jsx)(`button`,{onClick:()=>i(e=>!e),children:`切换禁用 A`}),(0,a.jsx)(`button`,{onClick:o.clear,children:`清空限额选择`}),(0,a.jsxs)(`output`,{children:[o.selectedKeys.join(`,`)||`无`,` ·`,` `,o.isAtLimit?`已到上限`:`可继续选择`]})]})}var m=`import * as React from "react";

import { useSelection } from "../../../src";

function Enhanced2() {
  const [limit, setLimit] = React.useState(2),
    [disable, setDisable] = React.useState(false);
  const s = useSelection(["A", "B", "C", "D"], {
    maxSelected: limit,
    disabledKeys: disable ? ["A"] : [],
  });
  return (
    <>
      <label>
        最多选择
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[0, 1, 2, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <button onClick={s.selectAll}>按上限全选</button>
      <button onClick={() => setDisable((v) => !v)}>切换禁用 A</button>
      <button onClick={s.clear}>清空限额选择</button>
      <output>
        {s.selectedKeys.join(",") || "无"} ·{" "}
        {s.isAtLimit ? "已到上限" : "可继续选择"}
      </output>
    </>
  );
}

export default Enhanced2;
`;function h(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`半选与全选状态`,description:`选择一项进入半选，全选和清空使用不同操作，空列表不会被视为全选。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:u,title:`切换查询时重置`,description:`preserve 保留跨页选择，但 resetKey 变化会清空旧查询的选择。`,children:(0,a.jsx)(l,{})}),(0,a.jsx)(e,{source:f,title:`Shift 范围与禁用项`,description:`先点 A，再按住 Shift 点 E，范围选中跳过禁用的 C；也可用按钮执行相同范围选择。`,children:(0,a.jsx)(d,{})}),(0,a.jsx)(e,{source:m,title:`选择上限与动态裁剪`,description:`设置最多可选数量，批量选择遵守上限；缩小上限或禁用已选项会自动裁剪。`,children:(0,a.jsx)(p,{})})]})}export{h as default};