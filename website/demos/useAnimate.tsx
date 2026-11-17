import { useRef } from "react";
import { useAnimate } from "../../src";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useAnimate(ref);
  return (
    <div className="demo-stack">
      <div className="animation-stage">
        <div ref={ref} className="animation-orb">
          W
        </div>
      </div>
      <div className="demo-row">
        <button
          onClick={() =>
            animation.play(
              [
                { transform: "translateX(0) rotate(0)", opacity: 0.4 },
                { transform: "translateX(160px) rotate(90deg)", opacity: 1 },
              ],
              { duration: 1100, fill: "forwards", easing: "ease-in-out" },
            )
          }
        >
          播放动画
        </button>
        <button className="secondary" onClick={animation.pause}>
          暂停
        </button>
        <button className="secondary" onClick={animation.resume}>
          继续
        </button>
        <button className="secondary" onClick={animation.reverse}>
          反向
        </button>
        <button className="secondary" onClick={animation.cancel}>
          重置
        </button>
      </div>
      <output>状态：{animation.status}</output>
    </div>
  );
}
