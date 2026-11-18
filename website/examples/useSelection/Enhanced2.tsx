import * as React from "react";

import { useSelection } from "../../../src";

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

export default Enhanced2;
