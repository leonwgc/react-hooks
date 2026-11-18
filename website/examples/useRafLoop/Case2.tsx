import * as React from "react";

import { useRafLoop } from "../../../src";

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

export default Case2;
