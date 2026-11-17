import { useSearch } from "../../src";

export default function Demo() {
  const search = useSearch({ keyword: "" });
  return (
    <form
      className="demo-stack"
      onSubmit={(e) => {
        e.preventDefault();
        search.submit();
      }}
    >
      <label>
        查询条件
        <input
          value={search.draft.keyword}
          onChange={(e) => search.setDraft({ keyword: e.target.value })}
        />
      </label>
      <div className="demo-row">
        <button>提交查询</button>
        <button type="button" className="secondary" onClick={search.reset}>
          重置
        </button>
      </div>
      <output>已提交：{search.submitted.keyword || "全部"}</output>
    </form>
  );
}
