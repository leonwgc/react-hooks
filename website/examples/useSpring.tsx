import * as React from "react";
import { useSpring } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [target, setTarget] = React.useState(0);
  const [damping, setDamping] = React.useState(10);
  const s = useSpring(target, { damping });
  return (
    <>
      <label>
        弹簧阻尼
        <input
          type="range"
          min={5}
          max={40}
          value={damping}
          onChange={(e) => setDamping(Number(e.target.value))}
        />
      </label>
      <button onClick={() => setTarget((t) => (t === 0 ? 100 : 0))}>
        改变物理目标
      </button>
      <div className="animation-stage">
        <div
          className="animation-orb"
          style={{ transform: `translateX(${s.value}px)` }}
        >
          S
        </div>
      </div>
      <output>
        值 {s.value.toFixed(1)} · 速度 {s.velocity.toFixed(1)}/s
      </output>
    </>
  );
}
function Case2() {
  const [target, setTarget] = React.useState(0);
  const s = useSpring(target, { stiffness: 35, damping: 8 });
  return (
    <>
      <button onClick={() => setTarget(100)}>开始慢速弹簧</button>
      <button onClick={s.stop}>暂停弹簧</button>
      <button onClick={s.restart}>继续弹簧</button>
      <button onClick={s.finish}>吸附到目标</button>
      <output>
        {s.value.toFixed(1)} · {s.animating ? "动画中" : "停止"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="调整阻尼观察回弹"
        description="低阻尼会有更明显回弹；高阻尼更平缓，系统减少动态效果时直接到达目标。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="暂停、继续与立即到达"
        description="暂停保留当前值；restart 从当前位置继续追踪目标，finish 直接吸附。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
