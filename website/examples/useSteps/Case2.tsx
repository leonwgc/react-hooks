import * as React from "react";

import { useSteps } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(5);
  const s = useSteps({ count });
  return (
    <>
      <button onClick={() => void s.goTo(4)}>跳到第五步</button>
      <button onClick={() => setCount(2)}>缩减为两步</button>
      <button onClick={() => s.reset()}>回到流程起点</button>
      <output>
        步骤 {s.step + 1} / {s.count} · 完成 {s.completed.join(",") || "无"}
      </output>
    </>
  );
}

export default Case2;
