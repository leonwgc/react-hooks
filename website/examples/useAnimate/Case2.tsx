import * as React from "react";

import { useAnimate } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const a = useAnimate(ref);
  return (
    <>
      <div className="animation-stage">
        <div ref={ref} className="animation-orb">
          ↔
        </div>
      </div>
      <button
        onClick={() =>
          a.play(
            { transform: ["translateX(0)", "translateX(80px)"] },
            { duration: 500, direction: "alternate", iterations: 4 },
          )
        }
      >
        播放往返动画
      </button>
      <button onClick={a.pause}>暂停往返</button>
      <button onClick={a.resume}>恢复往返</button>
      <output>{a.status}</output>
    </>
  );
}

export default Case2;
