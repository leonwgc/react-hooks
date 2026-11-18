import * as React from "react";

import { useCountdown } from "../../../src";

function Case1() {
  const [target, setTarget] = React.useState<number | null>(null);
  const [ends, setEnds] = React.useState(0);
  const c = useCountdown(target, {
    interval: 100,
    onEnd: () => setEnds((n) => n + 1),
  });
  return (
    <>
      <button onClick={() => setTarget(Date.now() + 3000)}>
        开始三秒倒计时
      </button>
      <button onClick={() => setTarget(null)}>取消倒计时</button>
      <output>
        剩余 {Math.ceil(c.remaining / 1000)}s · 已结束 {ends} 次
      </output>
    </>
  );
}

export default Case1;
