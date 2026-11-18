import * as React from "react";
import { useSetState } from "../../src";
import { Scenario } from "./Scenario";

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
function Case2() {
  const [state, set] = useSetState(() => ({
    profile: { name: "小林", city: "上海" },
    count: 0,
  }));
  return (
    <>
      <button
        onClick={() =>
          set((s) => ({
            profile: {
              ...s.profile,
              city: s.profile.city === "上海" ? "杭州" : "上海",
            },
          }))
        }
      >
        切换城市并保留姓名
      </button>
      <button
        onClick={() => {
          set((s) => ({ count: s.count + 1 }));
          set((s) => ({ count: s.count + 1 }));
        }}
      >
        连续加两次
      </button>
      <output>
        {state.profile.name} · {state.profile.city} · 计数 {state.count}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="多字段筛选条件"
        description="修改一个字段会保留其他字段，支持一次提交多个字段。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="嵌套对象与连续更新"
        description="显式复制嵌套结构；连续两次函数更新会基于前一次结果累计。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
