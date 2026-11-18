import * as React from "react";
import { useEventListener } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useEventListener("click", () => setCount((n) => n + 1), enabled ? ref : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停监听" : "恢复监听"}
      </button>
      <button ref={ref}>触发原生点击</button>
      <output>收到 {count} 次</output>
    </>
  );
}
function Case2() {
  const parent = React.useRef<HTMLDivElement>(null);
  const child = React.useRef<HTMLButtonElement>(null);
  const [log, setLog] = React.useState<string[]>([]);
  useEventListener(
    "click",
    () => setLog((s) => [...s.slice(-5), "父捕获"]),
    parent,
    { capture: true },
  );
  useEventListener("click", () => setLog((s) => [...s, "子点击"]), child);
  return (
    <>
      <div ref={parent}>
        <button ref={child}>观察事件顺序</button>
      </div>
      <button onClick={() => setLog([])}>清空事件记录</button>
      <output>{log.join(" → ") || "等待点击"}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="动态启停元素监听"
        description="传入 null 暂停绑定，恢复后继续监听按钮的原生 click。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="捕获与冒泡顺序"
        description="父元素捕获监听与子元素原生监听共同记录事件传播顺序。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
