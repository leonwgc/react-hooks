import { useUrlState } from "../../../src";

function Case1() {
  const [state, set] = useUrlState({
    exampleCategory: "全部",
    examplePage: "1",
  });
  return (
    <>
      <button
        onClick={() => set({ exampleCategory: "教程", examplePage: "2" })}
      >
        设置教程第 2 页
      </button>
      <button onClick={() => set({ exampleCategory: null, examplePage: null })}>
        清除演示参数
      </button>
      <output>
        {state.exampleCategory ?? "默认分类"} / {state.examplePage ?? "默认页"}
      </output>
    </>
  );
}

export default Case1;
