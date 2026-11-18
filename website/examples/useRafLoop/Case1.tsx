import * as React from "react";

import { useRafLoop } from "../../../src";

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

export default Case1;
