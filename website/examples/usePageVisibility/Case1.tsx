import * as React from "react";

import { usePageVisibility, useInterval } from "../../../src";

function Case1() {
  const visibility = usePageVisibility();
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(0);
  useInterval(
    () => setCount((n) => n + 1),
    active && visibility === "visible" ? 500 : null,
  );
  return (
    <>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "停止可见轮询" : "启动可见轮询"}
      </button>
      <output>
        {visibility} · 已轮询 {count} 次
      </output>
    </>
  );
}

export default Case1;
