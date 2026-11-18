import * as React from "react";
import { useKeyPress } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useKeyPress("enter", () => setCount((n) => n + 1), { scope, enabled });
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停快捷键" : "启用快捷键"}
      </button>
      <div ref={scope}>
        <button>聚焦这里后按 Enter</button>
      </div>
      <output>局部命令 {count} 次</output>
    </>
  );
}
function Case2() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [key, setKey] = React.useState("等待快捷键");
  useKeyPress(["alt+j", "alt+l"], (e) => setKey(e.key), {
    scope,
    allowInInput: true,
    preventDefault: true,
    repeat: false,
  });
  return (
    <div ref={scope}>
      <label>
        命令输入区
        <input placeholder="按 Alt+J 或 Alt+L" />
      </label>
      <output>最近命令：{key}</output>
    </div>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="动态启用局部快捷键"
        description="聚焦区域按钮后按 Enter；暂停绑定时不触发。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="输入框中的多组合键"
        description="允许在输入框内使用 Alt+J / Alt+L，禁止默认动作并忽略长按重复。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
