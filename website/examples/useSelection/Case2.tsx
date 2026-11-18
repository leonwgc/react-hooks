import * as React from "react";

import { useSelection } from "../../../src";

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

export default Case2;
