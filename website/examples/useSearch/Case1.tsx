import { useSearch } from "../../../src";

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
