import * as React from "react";
import { useDocumentTitle } from "../../src";
import { Scenario } from "./Scenario";
function TemporaryTitle() {
  useDocumentTitle("临时预览标题");
  return <p>临时标题拥有者已挂载。</p>;
}
function Case1() {
  const [count, setCount] = React.useState(0);
  useDocumentTitle(count ? `(${count}) 新消息` : "消息中心");
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>收到一条演示消息</button>
      <button onClick={() => setCount(0)}>标记全部已读</button>
      <output>未读 {count} 条，查看浏览器标题。</output>
    </>
  );
}
function Case2() {
  useDocumentTitle("场景父标题");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "关闭临时标题" : "打开临时标题"}
      </button>
      {open && <TemporaryTitle />}
      <p>观察标签标题的接管与恢复。</p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="未读消息标题"
        description="改变未读数量，实时将数量反映到浏览器标题中。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="临时标题与卸载恢复"
        description="显示临时子组件后，它接管标题；关闭子组件恢复当前场景标题。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
