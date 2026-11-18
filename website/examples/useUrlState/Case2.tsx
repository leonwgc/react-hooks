import { useUrlState } from "../../../src";

function Case2() {
  const [state, set] = useUrlState({ exampleTab: "简介" }, "push");
  return (
    <>
      <button onClick={() => set({ exampleTab: "详情" })}>
        进入详情并记录历史
      </button>
      <button onClick={() => set({ exampleTab: "评论" })}>
        进入评论并记录历史
      </button>
      <output>URL 页签：{state.exampleTab}</output>
      <p>请使用浏览器后退键观察恢复；其他演示参数保持不变。</p>
    </>
  );
}

export default Case2;
