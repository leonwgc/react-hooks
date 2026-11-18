var e=`import * as React from "react";
import { useCountdown } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="截止回调与重新启动"
        description="设置三秒目标，结束后记录回调次数；可提前取消或重新计时。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="过期目标与延长截止"
        description="传入过去时间立即得到零；新目标会重新计算剩余时间。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};