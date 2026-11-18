var e=`import * as React from "react";
import { useVirtualList } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const items = React.useMemo(
    () => Array.from({ length: 200 }, (_, i) => \`记录 \${i + 1}\`),
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="固定行高与定位方式"
        description="在两百条数据中跳转到指定索引，可选择居中或末尾对齐。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="空列表与追加数据"
        description="从空列表开始添加数据，清空后占位高度归零，避免保留旧滚动范围。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};