import * as React from "react";
import { useSelection } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const s = useSelection<number>([1, 2, 3]);
  return (
    <>
      <div className="demo-row">
        {[1, 2, 3].map((key) => (
          <button
            key={key}
            aria-pressed={s.isSelected(key)}
            onClick={() => s.toggle(key)}
          >
            项目 {key}
            {s.isSelected(key) ? " ✓" : ""}
          </button>
        ))}
      </div>
      <button onClick={s.selectAll}>选择全部项目</button>
      <button onClick={s.clear}>清空项目选择</button>
      <output>
        半选 {String(s.partiallySelected)} · 全选 {String(s.allSelected)} · 已选{" "}
        {s.selectedKeys.join(",") || "无"}
      </output>
    </>
  );
}
function Case2() {
  const [query, setQuery] = React.useState("全部");
  const s = useSelection(["A", "B"], { preserve: true, resetKey: query });
  return (
    <>
      <button onClick={() => s.toggle("A")}>切换选择 A</button>
      <button onClick={() => s.toggle("B")}>切换选择 B</button>
      <button onClick={() => setQuery((v) => (v === "全部" ? "收藏" : "全部"))}>
        切换查询范围
      </button>
      <output>
        查询 {query} · 已选 {s.selectedKeys.join(",") || "无"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="半选与全选状态"
        description="选择一项进入半选，全选和清空使用不同操作，空列表不会被视为全选。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="切换查询时重置"
        description="preserve 保留跨页选择，但 resetKey 变化会清空旧查询的选择。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
