import { useVirtualList } from "../../src";
const records = Array.from({ length: 10000 }, (_, id) => ({
  id,
  title: `记录 ${id + 1}`,
}));
export default function Demo() {
  const list = useVirtualList(records, {
    itemHeight: 36,
    height: 220,
    getKey: (item) => item.id,
  });
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={() => list.scrollTo(4999, "center")}>
          定位第 5000 项
        </button>
        <output>10000 项 / 当前渲染 {list.virtualItems.length} 项</output>
      </div>
      <div
        ref={list.containerRef}
        onScroll={list.onScroll}
        style={list.containerStyle}
        role="list"
        aria-label="虚拟记录列表"
        tabIndex={0}
      >
        <div style={{ height: list.totalHeight, position: "relative" }}>
          {list.virtualItems.map((row) => (
            <div
              key={row.key}
              style={row.style}
              role="listitem"
              aria-posinset={row.index + 1}
              aria-setsize={records.length}
            >
              {row.item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
