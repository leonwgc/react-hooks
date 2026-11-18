import * as React from "react";
import { useSearch } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="组合筛选与提交快照"
        description="编辑分类不会立即改变已提交条件，点击提交后一起生效。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="同条件刷新与恢复默认"
        description="重复提交增加 revision；reset 恢复初始条件并产生一次新的查询版本。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
