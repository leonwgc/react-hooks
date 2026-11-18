import * as React from "react";

import { useInterval } from "../../../src";

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

export default Case1;
