import * as React from "react";
import { useInterval } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [count, setCount] = React.useState(0);
  const [delay, setDelay] = React.useState(500);
  const [active, setActive] = React.useState(false);
  useInterval(() => setCount((n) => n + 1), active ? delay : null);
  return (
    <>
      <label>
        计时周期
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        >
          <option value={200}>200ms</option>
          <option value={1000}>1000ms</option>
          <option value={500}>500ms</option>
        </select>
      </label>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "暂停计数" : "开始计数"}
      </button>
      <output>累计 {count} 次</output>
    </>
  );
}
function Case2() {
  const [count, setCount] = React.useState(0);
  const [active, setActive] = React.useState(false);
  useInterval(() => setCount((n) => n + 1), active ? 2000 : null, true);
  return (
    <>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "停用即时任务" : "启用即时任务"}
      </button>
      <output>任务执行 {count} 次</output>
      <p>
        开发 Strict Mode
        的挂载检查可能重复执行初始化任务，实际写操作请保持幂等。
      </p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="调整节奏与暂停"
        description="在运行时改变间隔，暂停后保留计数，恢复后按新间隔继续。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="启用时立即执行"
        description="immediate 为 true 时，启用定时器立即执行一次，然后按间隔运行。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
