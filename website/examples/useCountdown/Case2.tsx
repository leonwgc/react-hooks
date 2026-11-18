import * as React from "react";

import { useCountdown } from "../../../src";

function Case2() {
  const [target, setTarget] = React.useState<number | null>(null);
  const c = useCountdown(target);
  return (
    <>
      <button onClick={() => setTarget(Date.now() - 1000)}>设置过期目标</button>
      <button onClick={() => setTarget(Date.now() + 65000)}>
        设置 65 秒目标
      </button>
      <button onClick={() => setTarget((t) => (t ?? Date.now()) + 10000)}>
        延长十秒
      </button>
      <output>
        {Math.floor(c.seconds / 60)} 分 {c.seconds % 60} 秒 · 剩余 {c.remaining}
        ms
      </output>
    </>
  );
}

export default Case2;
