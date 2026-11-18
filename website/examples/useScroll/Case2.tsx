import * as React from "react";

import { useScroll } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { y } = useScroll(ref);
  return (
    <>
      <div ref={ref} className="scroll-pad">
        <div style={{ height: 600 }}>长文章内容，向下滚动阅读。</div>
      </div>
      <progress
        aria-label="容器阅读进度"
        value={y}
        max={Math.max(
          1,
          (ref.current?.scrollHeight ?? 600) -
            (ref.current?.clientHeight ?? 180),
        )}
      />
      <button
        onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
      >
        回到阅读顶部
      </button>
      <output>已阅读偏移 {Math.round(y)}px</output>
    </>
  );
}

export default Case2;
