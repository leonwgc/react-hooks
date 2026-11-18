import * as React from "react";
import { useTable } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
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
function Case2() {
  const [fail, setFail] = React.useState(true);
  const t = useTable(
    async ({ signal }) => {
      await delay(signal, 150);
      if (fail) throw Error("列表服务暂时不可用");
      return { list: [{ id: 1, title: "恢复后的记录" }], total: 1 };
    },
    { initialFilters: { keyword: "" }, select: (response) => response },
  );
  return (
    <>
      <button onClick={() => setFail((v) => !v)}>
        {fail ? "关闭失败模拟" : "启用失败模拟"}
      </button>
      <button onClick={t.refresh}>刷新当前表格</button>
      <button onClick={t.search.reset}>重置表格查询</button>
      <output>{t.loading ? "表格加载中" : `已加载 ${t.list.length} 条`}</output>
      {!!t.error && <p role="alert">{String(t.error)}</p>}
      <ul>
        {t.list.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="适配不同服务响应"
        description="select 把 records/count 转为 list/total；分页变化会重新调用本地模拟服务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="请求失败与刷新恢复"
        description="演示服务失败后保留页面控制，关闭失败模拟后 refresh 重新获取当前查询。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
