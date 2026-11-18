import { usePagination } from "../../../src";

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

export default Case1;
