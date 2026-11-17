import { useRef } from "react";
import { useScroll } from "../../src";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const { y } = useScroll(ref);
  return (
    <div className="demo-stack">
      <output>已滚动 {Math.round(y)} px</output>
      <div ref={ref} className="scroll-pad">
        <div
          style={{
            height: 500,
            background: "linear-gradient(var(--accent-soft), var(--surface))",
            padding: 20,
          }}
        >
          向下滚动阅读内容 ↓
        </div>
      </div>
    </div>
  );
}
