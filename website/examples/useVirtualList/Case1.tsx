import * as React from "react";

import { useVirtualList } from "../../../src";

function Case1() {
  const items = React.useMemo(
    () => Array.from({ length: 200 }, (_, i) => `记录 ${i + 1}`),
    [],
  );
  const v = useVirtualList(items, {
    itemHeight: 36,
    height: 180,
    getKey: (item) => item,
    overscan: 2,
  });
  return (
    <>
      <button onClick={() => v.scrollTo(99, "center")}>
        居中定位第 100 项
      </button>
      <button onClick={() => v.scrollTo(199, "end")}>定位最后一项</button>
      <div ref={v.containerRef} onScroll={v.onScroll} style={v.containerStyle}>
        <div style={{ height: v.totalHeight, position: "relative" }}>
          {v.virtualItems.map((row) => (
            <div key={row.key} style={row.style}>
              {row.item}
            </div>
          ))}
        </div>
      </div>
      <output>
        渲染 {v.virtualItems.length} / {items.length} 条
      </output>
    </>
  );
}

export default Case1;
