import * as React from "react";

import { useVirtualList } from "../../../src";

function Case2() {
  const [items, setItems] = React.useState<number[]>([]);
  const v = useVirtualList(items, {
    itemHeight: 32,
    height: 160,
    getKey: (item) => item,
  });
  return (
    <>
      <button
        onClick={() =>
          setItems((s) => [
            ...s,
            ...Array.from({ length: 50 }, (_, i) => s.length + i + 1),
          ])
        }
      >
        追加五十条
      </button>
      <button onClick={() => setItems([])}>清空虚拟数据</button>
      <div ref={v.containerRef} onScroll={v.onScroll} style={v.containerStyle}>
        {!items.length && <p>暂无记录</p>}
        <div style={{ height: v.totalHeight, position: "relative" }}>
          {v.virtualItems.map((row) => (
            <div key={row.key} style={row.style}>
              新增记录 {row.item}
            </div>
          ))}
        </div>
      </div>
      <output>
        总高度 {v.totalHeight}px · {items.length} 条
      </output>
    </>
  );
}

export default Case2;
