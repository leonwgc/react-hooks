import { useUrlState } from "../../src";

export default function Demo() {
  const [state, setState] = useUrlState({ keyword: "" });
  return (
    <div className="demo-stack">
      <label>
        URL 搜索词
        <input
          value={state.keyword ?? ""}
          onChange={(e) => setState({ keyword: e.target.value || null })}
          placeholder="观察地址栏中的查询参数"
        />
      </label>
      <button className="secondary" onClick={() => setState({ keyword: null })}>
        清除参数
      </button>
    </div>
  );
}
