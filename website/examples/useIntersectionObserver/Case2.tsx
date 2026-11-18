import * as React from "react";

import { useIntersectionObserver } from "../../../src";

function Case2() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, { root, rootMargin: "100px" });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 120 })}>
        滚动到预加载位置
      </button>
      <button onClick={() => root?.scrollTo({ top: 0 })}>回到容器顶部</button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 320 }}>目标位于下面</div>
        <div ref={target}>待预加载内容</div>
      </div>
      <output>
        {entry?.isIntersecting ? "进入预加载范围" : "尚未进入范围"}
      </output>
    </>
  );
}

export default Case2;
