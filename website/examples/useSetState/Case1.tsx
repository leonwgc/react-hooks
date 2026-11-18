import { useSetState } from "../../../src";

function Case1() {
  const [state, set] = useSetState({ keyword: "", status: "全部" });
  return (
    <>
      <label>
        筛选关键词
        <input
          value={state.keyword}
          onChange={(e) => set({ keyword: e.target.value })}
        />
      </label>
      <label>
        发布状态
        <select
          value={state.status}
          onChange={(e) => set({ status: e.target.value })}
        >
          <option>全部</option>
          <option>已发布</option>
        </select>
      </label>
      <button onClick={() => set({ keyword: "React", status: "已发布" })}>
        应用推荐筛选
      </button>
      <output>{JSON.stringify(state)}</output>
    </>
  );
}

export default Case1;
