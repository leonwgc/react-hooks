import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [page, setPage] = React.useState(1);
  const [store] = React.useState(() =>
    createQueryStore<string, readonly ["articles", { page: number }]>(
      async ({ signal }, [, params]) => {
        await delay(signal, 600);
        return `第 ${params.page} 页数据`;
      },
      { staleTime: Infinity },
    ),
  );
  const q = useQuery(store, ["articles", { page }], { keepPreviousData: true });
  return (
    <>
      <button disabled={q.isFetching} onClick={() => setPage((p) => p + 1)}>
        查询下一页
      </button>
      <button onClick={() => store.invalidate(["articles"], { exact: false })}>
        刷新文章前缀
      </button>
      <output>
        {q.data ?? "首次加载"} ·{" "}
        {q.isPreviousData ? "保留前页" : q.isFetching ? "刷新中" : "当前页"}
      </output>
    </>
  );
}

export default Enhanced1;
