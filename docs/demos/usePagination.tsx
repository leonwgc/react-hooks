import { usePagination } from "../../src";

export default function Demo() {
  const pagination = usePagination({ total: 96, initialPageSize: 10 });
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button disabled={pagination.page === 1} onClick={pagination.previous}>
          上一页
        </button>
        <output>
          第 {pagination.page} / {pagination.pageCount} 页
        </output>
        <button
          disabled={pagination.page === pagination.pageCount}
          onClick={pagination.next}
        >
          下一页
        </button>
      </div>
      <label>
        每页条数
        <select
          value={pagination.pageSize}
          onChange={(e) => pagination.setPageSize(Number(e.target.value))}
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </label>
    </div>
  );
}
