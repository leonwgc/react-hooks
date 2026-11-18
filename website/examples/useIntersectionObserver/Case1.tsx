import * as React from "react";

import { useIntersectionObserver } from "../../../src";

function Case1() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, {
    root,
    threshold: [0, 0.5, 1],
  });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 240, behavior: "smooth" })}>
        滚动到目标
      </button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 220 }}>向下滚动</div>
        <div ref={target} className="notice">
          观察目标
        </div>
        <div style={{ height: 120 }} />
      </div>
      <output>
        可见比例 {Math.round((entry?.intersectionRatio ?? 0) * 100)}%
      </output>
    </>
  );
}

export default Case1;
