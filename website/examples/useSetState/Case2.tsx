import { useSetState } from "../../../src";

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

export default Case2;
