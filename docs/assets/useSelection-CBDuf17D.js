var e=`import * as React from "react";
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

function Enhanced1() {
  const keys = ["A", "B", "C", "D", "E"],
    s = useSelection(keys, { disabledKeys: ["C"] });
  return (
    <>
      <div className="demo-row">
        {keys.map((key) => (
          <button
            key={key}
            disabled={s.isDisabled(key)}
            aria-pressed={s.isSelected(key)}
            onClick={(e) => s.toggle(key, { range: e.shiftKey })}
          >
            {key}
          </button>
        ))}
      </div>
      <button onClick={() => s.selectRange("A", "E")}>选择 A 到 E</button>
      <button onClick={s.clear}>清空范围选择</button>
      <output>已选 {s.selectedKeys.join(",") || "无"}</output>
    </>
  );
}

function Enhanced2() {
  const [limit, setLimit] = React.useState(2),
    [disable, setDisable] = React.useState(false);
  const s = useSelection(["A", "B", "C", "D"], {
    maxSelected: limit,
    disabledKeys: disable ? ["A"] : [],
  });
  return (
    <>
      <label>
        最多选择
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[0, 1, 2, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <button onClick={s.selectAll}>按上限全选</button>
      <button onClick={() => setDisable((v) => !v)}>切换禁用 A</button>
      <button onClick={s.clear}>清空限额选择</button>
      <output>
        {s.selectedKeys.join(",") || "无"} ·{" "}
        {s.isAtLimit ? "已到上限" : "可继续选择"}
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
      <Scenario
        title="Shift 范围与禁用项"
        description="先点 A，再按住 Shift 点 E，范围选中跳过禁用的 C；也可用按钮执行相同范围选择。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="选择上限与动态裁剪"
        description="设置最多可选数量，批量选择遵守上限；缩小上限或禁用已选项会自动裁剪。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};