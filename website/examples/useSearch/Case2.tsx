import { useSearch } from "../../../src";

function Case2() {
  const s = useSearch({ status: "已发布" });
  return (
    <>
      <button
        onClick={() => {
          s.setDraft({ status: "草稿" });
          s.submit();
        }}
      >
        直接查询草稿
      </button>
      <button onClick={s.submit}>重新查询相同条件</button>
      <button onClick={s.reset}>恢复默认查询</button>
      <output>
        {s.submitted.status} · 查询版本 {s.revision}
      </output>
    </>
  );
}

export default Case2;
