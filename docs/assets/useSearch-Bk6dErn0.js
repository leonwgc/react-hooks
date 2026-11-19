import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t}from"./data-Cyz50yx1.js";import{D as n}from"./index-BH-UjxLV.js";import{t as r}from"./react-DvXU6kJ2.js";var i=n();function a(){let e=t({keyword:``,category:`全部`});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(`label`,{children:[`组合关键词`,(0,i.jsx)(`input`,{value:e.draft.keyword,onChange:t=>e.setDraft({keyword:t.target.value})})]}),(0,i.jsxs)(`label`,{children:[`组合分类`,(0,i.jsxs)(`select`,{value:e.draft.category,onChange:t=>e.setDraft({category:t.target.value}),children:[(0,i.jsx)(`option`,{children:`全部`}),(0,i.jsx)(`option`,{children:`教程`})]})]}),(0,i.jsx)(`button`,{onClick:e.submit,children:`提交组合条件`}),(0,i.jsxs)(`output`,{children:[`已提交 `,JSON.stringify(e.submitted)]})]})}var o=`import { useSearch } from "../../../src";

function Case1() {
  const s = useSearch({ keyword: "", category: "全部" });
  return (
    <>
      <label>
        组合关键词
        <input
          value={s.draft.keyword}
          onChange={(e) => s.setDraft({ keyword: e.target.value })}
        />
      </label>
      <label>
        组合分类
        <select
          value={s.draft.category}
          onChange={(e) => s.setDraft({ category: e.target.value })}
        >
          <option>全部</option>
          <option>教程</option>
        </select>
      </label>
      <button onClick={s.submit}>提交组合条件</button>
      <output>已提交 {JSON.stringify(s.submitted)}</output>
    </>
  );
}

export default Case1;
`;function s(){let e=t({status:`已发布`});return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{onClick:()=>{e.setDraft({status:`草稿`}),e.submit()},children:`直接查询草稿`}),(0,i.jsx)(`button`,{onClick:e.submit,children:`重新查询相同条件`}),(0,i.jsx)(`button`,{onClick:e.reset,children:`恢复默认查询`}),(0,i.jsxs)(`output`,{children:[e.submitted.status,` · 查询版本 `,e.revision]})]})}var c=`import { useSearch } from "../../../src";

function Case2() {
  const s = useSearch({ status: "已发布" });
  return (
    <>
      <button
        onClick={() => {
          s.setDraft({ status: "草稿" });
          s.submit();
        }}
      >
        直接查询草稿
      </button>
      <button onClick={s.submit}>重新查询相同条件</button>
      <button onClick={s.reset}>恢复默认查询</button>
      <output>
        {s.submitted.status} · 查询版本 {s.revision}
      </output>
    </>
  );
}

export default Case2;
`;r();function l(){let e=t({keyword:``}),n={keyword:`发布`};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`button`,{onClick:()=>e.setDraft({status:`open`,owner:`我`}),children:`添加状态和负责人条件`}),(0,i.jsx)(`button`,{onClick:()=>e.setDraft(n),children:`setDraft 合并预设`}),(0,i.jsx)(`button`,{onClick:()=>e.replaceDraft(n),children:`replaceDraft 整体替换`}),(0,i.jsx)(`button`,{className:`secondary`,onClick:e.submit,children:`提交`}),(0,i.jsxs)(`output`,{children:[`草稿：`,JSON.stringify(e.draft)]}),(0,i.jsxs)(`output`,{children:[`已提交：`,JSON.stringify(e.submitted)]})]})}var u=`import * as React from "react";

import { useSearch } from "../../../src";

type Filters = { keyword: string; status?: string; owner?: string };

function Feature1() {
  const s = useSearch<Filters>({ keyword: "" });
  const preset: Filters = { keyword: "发布" };
  return (
    <>
      <button onClick={() => s.setDraft({ status: "open", owner: "我" })}>
        添加状态和负责人条件
      </button>
      <button onClick={() => s.setDraft(preset)}>setDraft 合并预设</button>
      <button onClick={() => s.replaceDraft(preset)}>
        replaceDraft 整体替换
      </button>
      <button className="secondary" onClick={s.submit}>
        提交
      </button>
      <output>草稿：{JSON.stringify(s.draft)}</output>
      <output>已提交：{JSON.stringify(s.submitted)}</output>
    </>
  );
}

export default Feature1;
`;function d(){return(0,i.jsxs)(`div`,{className:`additional-demos`,children:[(0,i.jsx)(e,{source:o,title:`组合筛选与提交快照`,description:`编辑分类不会立即改变已提交条件，点击提交后一起生效。`,children:(0,i.jsx)(a,{})}),(0,i.jsx)(e,{source:c,title:`同条件刷新与恢复默认`,description:`重复提交增加 revision；reset 恢复初始条件并产生一次新的查询版本。`,children:(0,i.jsx)(s,{})}),(0,i.jsx)(e,{source:u,title:`合并与整体替换草稿`,description:`setDraft 浅合并会保留旧条件，replaceDraft 会用预设整体替换草稿。`,children:(0,i.jsx)(l,{})})]})}export{d as default};