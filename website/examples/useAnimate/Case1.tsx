import * as React from "react";

import { useAnimate } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const a = useAnimate(ref);
  return (
    <>
      <div ref={ref} className="notice">
        操作已完成
      </div>
      <button
        onClick={() =>
          a.play([{ opacity: 0 }, { opacity: 1 }], {
            duration: 700,
            fill: "forwards",
          })
        }
      >
        播放淡入反馈
      </button>
      <button onClick={a.cancel}>取消淡入反馈</button>
      <output>动画状态 {a.status}</output>
    </>
  );
}

export default Case1;
