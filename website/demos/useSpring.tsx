import { useState } from "react";
import { useSpring } from "../../src";
export default function Demo() {
  const [target, setTarget] = useState(0);
  const spring = useSpring(target);
  return (
    <div className="demo-stack">
      <label>
        目标进度
        <input
          type="range"
          min={0}
          max={100}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
      </label>
      <progress value={spring.value} max={100} aria-label="弹簧进度" />
      <button onClick={() => setTarget((t) => (t === 0 ? 100 : 0))}>
        切换弹簧目标
      </button>
      <button onClick={spring.finish}>立即完成弹簧</button>
      <output>
        {spring.value.toFixed(1)} · {spring.animating ? "运动中" : "静止"}
      </output>
    </div>
  );
}
