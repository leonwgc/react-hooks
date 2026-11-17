import { useState } from "react";
import { useSelection } from "../../src";

export default function Demo() {
  const [page, setPage] = useState(1);
  const [preserve, setPreserve] = useState(false);
  const keys =
    page === 1 ? ["文章 A", "文章 B", "文章 C"] : ["文章 D", "文章 E"];
  const selection = useSelection(keys, { preserve });
  return (
    <div className="demo-stack">
      <label className="check">
        <input
          type="checkbox"
          checked={preserve}
          onChange={(e) => setPreserve(e.target.checked)}
        />
        跨页保留选择
      </label>
      {keys.map((key) => (
        <label className="check" key={key}>
          <input
            type="checkbox"
            checked={selection.isSelected(key)}
            onChange={() => selection.toggle(key)}
          />
          {key}
        </label>
      ))}
      <div className="demo-row">
        <button onClick={selection.toggleAll}>切换本页全选</button>
        <button
          className="secondary"
          onClick={() => setPage((p) => (p === 1 ? 2 : 1))}
        >
          切换页面
        </button>
      </div>
      <output>已选：{selection.selectedKeys.join("、") || "无"}</output>
    </div>
  );
}
