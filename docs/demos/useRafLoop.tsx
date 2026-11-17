import { useState } from "react";
import { useRafLoop } from "../../src";

export default function Demo() {
  const [progress, setProgress] = useState(0);
  const loop = useRafLoop(
    ({ delta }) => setProgress((value) => (value + delta / 60) % 100),
    false,
  );
  return (
    <div className="demo-stack">
      <progress value={progress} max={100} aria-label="逐帧动画进度" />
      <div className="demo-row">
        <button onClick={loop.running ? loop.stop : loop.start}>
          {loop.running ? "停止" : "开始逐帧动画"}
        </button>
        <output>{Math.round(progress)}%</output>
      </div>
    </div>
  );
}
