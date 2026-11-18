import { useSelection } from "../../../src";

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

export default Case1;
