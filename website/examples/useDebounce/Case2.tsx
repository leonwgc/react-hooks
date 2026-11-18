import * as React from "react";

import { useDebounce } from "../../../src";

function Case2() {
  const [filters, setFilters] = React.useState({ keyword: "", limit: 10 });
  const value = useDebounce(filters, 400);
  return (
    <>
      <label>
        对象关键词
        <input
          value={filters.keyword}
          onChange={(e) =>
            setFilters((s) => ({ ...s, keyword: e.target.value }))
          }
        />
      </label>
      <button
        onClick={() =>
          setFilters((s) => ({ ...s, limit: s.limit === 10 ? 20 : 10 }))
        }
      >
        切换 10 / 20 条
      </button>
      <output>待查询条件：{JSON.stringify(value)}</output>
    </>
  );
}

export default Case2;
