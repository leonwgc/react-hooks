import * as React from "react";

import { usePagination } from "../../../src";

function Case2() {
  const [total, setTotal] = React.useState(42);
  const p = usePagination({ total, initialPageSize: 10 });
  return (
    <>
      <button onClick={() => p.setPage(999)}>尝试跳到 999 页</button>
      <button onClick={() => setTotal(12)}>总数减为 12</button>
      <button onClick={() => setTotal(0)}>清空所有记录</button>
      <output>
        第 {p.page} / {p.pageCount} 页 · 共 {total} 条
      </output>
    </>
  );
}

export default Case2;
