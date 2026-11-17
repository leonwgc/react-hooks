import { useRef } from "react";
import { useIntersectionObserver } from "../../src";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.5 });
  return (
    <div className="demo-stack">
      <output>目标{entry?.isIntersecting ? "已进入" : "未进入"}视口</output>
      <div className="scroll-pad">
        <p style={{ minHeight: 180 }}>向下滚动这个区域 ↓</p>
        <div ref={ref} className="notice">
          这里是被观察的元素
        </div>
      </div>
    </div>
  );
}
