var e=`import * as React from "react";
import { useRafLoop } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [speed, setSpeed] = React.useState(20);
  const [value, setValue] = React.useState(0);
  const loop = useRafLoop(
    ({ delta }) => setValue((n) => (n + (delta * speed) / 1000) % 100),
    false,
  );
  return (
    <>
      <label>
        每秒速率
        <input
          type="range"
          min={5}
          max={80}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
      <button onClick={loop.start}>开始按速度推进</button>
      <button onClick={loop.stop}>停止推进</button>
      <progress aria-label="速度演示进度" max={100} value={value} />
      <output>
        {loop.running ? "运行中" : "已停止"} · {Math.round(value)}%
      </output>
    </>
  );
}
function Case2() {
  const [delta, setDelta] = React.useState(0);
  const loop = useRafLoop((frame) => setDelta(frame.delta), false);
  return (
    <>
      <button onClick={loop.start}>开始帧采样</button>
      <button onClick={loop.stop}>停止帧采样</button>
      <output>
        帧间隔 {delta.toFixed(1)}ms · 近似{" "}
        {delta > 0 ? Math.round(1000 / delta) : 0}fps
      </output>
      <p>切回标签页可能出现大间隔，数值只用于诊断观察。</p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="基于 delta 的速度控制"
        description="改变每秒速率后，进度仍按真实帧间隔推进，开始和停止均可重复调用。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="帧间隔采样"
        description="实时采样 delta 并展示近似帧率；停止后保持最后一次采样结果。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};