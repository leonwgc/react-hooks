import * as React from "react";

import { useInterval } from "../../../src";

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

export default Case2;
