import{t as e}from"./Scenario-qCntdwnE.js";import{r as t}from"./data-Dj72mn0-.js";import{D as n}from"./index--S_n-0Gu.js";var r=n();function i(){let e=t({keyword:``,category:`全部`});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`label`,{children:[`组合关键词`,(0,r.jsx)(`input`,{value:e.draft.keyword,onChange:t=>e.setDraft({keyword:t.target.value})})]}),(0,r.jsxs)(`label`,{children:[`组合分类`,(0,r.jsxs)(`select`,{value:e.draft.category,onChange:t=>e.setDraft({category:t.target.value}),children:[(0,r.jsx)(`option`,{children:`全部`}),(0,r.jsx)(`option`,{children:`教程`})]})]}),(0,r.jsx)(`button`,{onClick:e.submit,children:`提交组合条件`}),(0,r.jsxs)(`output`,{children:[`已提交 `,JSON.stringify(e.submitted)]})]})}var a=`import { useSearch } from "../../../src";

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
`;function o(){let e=t({status:`已发布`});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>{e.setDraft({status:`草稿`}),e.submit()},children:`直接查询草稿`}),(0,r.jsx)(`button`,{onClick:e.submit,children:`重新查询相同条件`}),(0,r.jsx)(`button`,{onClick:e.reset,children:`恢复默认查询`}),(0,r.jsxs)(`output`,{children:[e.submitted.status,` · 查询版本 `,e.revision]})]})}var s=`import { useSearch } from "../../../src";

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
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`组合筛选与提交快照`,description:`编辑分类不会立即改变已提交条件，点击提交后一起生效。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`同条件刷新与恢复默认`,description:`重复提交增加 revision；reset 恢复初始条件并产生一次新的查询版本。`,children:(0,r.jsx)(o,{})})]})}export{c as default};