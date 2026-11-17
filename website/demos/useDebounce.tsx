import { useState } from "react";
import { useDebounce } from "../../src";

export default function Demo() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 500);
  return (
    <div className="demo-stack">
      <label>
        搜索关键词
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入后等待 500ms"
        />
      </label>
      <output>实际查询：{debounced || "等待输入"}</output>
    </div>
  );
}
