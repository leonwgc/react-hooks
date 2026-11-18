import { useTable } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const t = useTable(
    async ({ signal }, query) => {
      await delay(signal, 150);
      return {
        records: Array.from({ length: query.pageSize }, (_, i) => ({
          id: (query.page - 1) * query.pageSize + i + 1,
        })),
        count: 30,
      };
    },
    {
      initialFilters: {},
      pageSize: 5,
      select: (response) => ({ list: response.records, total: response.count }),
    },
  );
  return (
    <>
      <button onClick={() => t.setPage(t.page + 1)}>查询响应适配下一页</button>
      <button onClick={() => t.setPageSize(10)}>切换每页十条</button>
      <output>
        第 {t.page} 页 · 总数 {t.total} · {t.loading ? "加载中" : "已加载"}
      </output>
      <ul>
        {t.list.map((item) => (
          <li key={item.id}>记录 {item.id}</li>
        ))}
      </ul>
      {!!t.error && <p role="alert">{String(t.error)}</p>}
    </>
  );
}

export default Case1;
