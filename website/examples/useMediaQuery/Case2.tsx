import * as React from "react";

import { useMediaQuery } from "../../../src";

function Case2() {
  const [query, setQuery] = React.useState("(hover: hover)");
  const matches = useMediaQuery(query);
  return (
    <>
      <label>
        媒体能力
        <select value={query} onChange={(e) => setQuery(e.target.value)}>
          <option>(hover: hover)</option>
          <option>(pointer: fine)</option>
          <option>(prefers-color-scheme: dark)</option>
        </select>
      </label>
      <output>
        {query}：{matches ? "支持 / 匹配" : "不匹配"}
      </output>
    </>
  );
}

export default Case2;
