var e=`import * as React from "react";
import { useMutationObserver } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    attributes: true,
    attributeFilter: ["data-status"],
  });
  return (
    <>
      <div ref={ref} className="notice">
        外部插件宿主
      </div>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-status", String(Date.now()))
        }
      >
        修改观察属性
      </button>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-other", String(Date.now()))
        }
      >
        修改忽略属性
      </button>
      <output>观察到 {count} 条属性变化</output>
    </>
  );
}
function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    childList: true,
    subtree: true,
  });
  return (
    <>
      <div ref={ref} className="notice" />
      <button
        onClick={() => {
          const node = document.createElement("p");
          node.textContent = "外部段落";
          ref.current?.append(node);
        }}
      >
        追加外部段落
      </button>
      <button onClick={() => ref.current?.replaceChildren()}>
        清空外部内容
      </button>
      <output>DOM 变更 {count} 条</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="观察指定属性"
        description="仅关注 data-status 的变化，其他属性变化不会计数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="观察子树与删除节点"
        description="添加嵌套节点或清空宿主，观察 childList 和 subtree 的记录。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};