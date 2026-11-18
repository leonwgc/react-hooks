import * as React from "react";

import { useSpring } from "../../../src";

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

export default Case1;
