import * as React from "react";

import { usePagination } from "../../../src";

function Feature1() {
  const p = usePagination({ total: 95, initialPageSize: 10 });
  return (
    <>
      <button
        onClick={() => {
          p.next();
          p.next();
          p.next();
        }}
      >
        同一事件内连续调用 next 三次
      </button>
      <button className="secondary" onClick={p.reset}>
        回到第 1 页
      </button>
      <output>
        第 {p.page} / {p.pageCount} 页
      </output>
    </>
  );
}

export default Feature1;
