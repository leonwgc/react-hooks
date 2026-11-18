import * as React from "react";

import { useTable } from "../../../src";

import { delay } from "../../demos/webHelpers";

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

export default Case2;
