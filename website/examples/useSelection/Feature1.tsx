import * as React from "react";

import { useSelection } from "../../../src";

const rows = ["A", "B", "C", "D", "E"];

function Feature1() {
  const s = useSelection(rows, { maxSelected: 3 });
  return (
    <>
      <button onClick={s.toggleAll}>
        {s.allSelected ? "取消全部选择" : "全选（最多 3 项）"}
      </button>
      <ul>
        {rows.map((row) => (
          <li key={row}>
            <label className="check">
              <input
                type="checkbox"
                checked={s.isSelected(row)}
                disabled={!s.isSelected(row) && s.isAtLimit}
                onChange={() => s.toggle(row)}
              />
              记录 {row}
            </label>
          </li>
        ))}
      </ul>
      <output>
        已选 {s.selectedKeys.join("、") || "无"} · allSelected：
        {String(s.allSelected)} · 已达上限：{String(s.isAtLimit)}
      </output>
    </>
  );
}

export default Feature1;
