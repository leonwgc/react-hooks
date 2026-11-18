import * as React from "react";
import { usePagination } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const p = usePagination({ initialPageSize: 5 });
  return (
    <>
      <button onClick={p.previous}>未知总数上一页</button>
      <button onClick={p.next}>未知总数下一页</button>
      <button onClick={p.reset}>回到第一页</button>
      <output>
        第 {p.page} 页 · 总页数 {p.pageCount ?? "未知"}
      </output>
    </>
  );
}
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="未知总数分页"
        description="不传 total，页数为未知，由服务或调用者决定是否还有下一页。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="总数减少与越界修正"
        description="先跳到最后一页，再减少总数或清空数据，观察页码限制。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
