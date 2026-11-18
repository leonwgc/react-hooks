var e=`import * as React from "react";
import { useUrlState } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="多条件同步与删除"
        description="使用独立演示参数，批量写入并单独删除，保留其他查询参数与 hash 路由。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="浏览器前进与后退"
        description="push 为每次选择新增历史，可用浏览器后退恢复上一次 URL 状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};