var e=`import * as React from "react";
import { useAnimate } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="淡入反馈与完成状态"
        description="播放短暂淡入动画，完成后状态变为 finished，取消可恢复初始样式。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="往返动画与重播"
        description="使用 alternate 和有限 iterations；运行中重播会取消上一段动画。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};