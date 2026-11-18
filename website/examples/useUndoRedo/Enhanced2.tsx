import { useUndoRedo } from "../../../src";

function Enhanced2() {
  const h = useUndoRedo({ title: "原始标题", size: 12 });
  return (
    <>
      <button
        disabled={h.inTransaction}
        onClick={() => h.beginTransaction("调整卡片")}
      >
        开始编辑事务
      </button>
      <button
        disabled={!h.inTransaction}
        onClick={() => {
          h.set((v) => ({ ...v, title: "新版标题" }));
          h.set((v) => ({ ...v, size: v.size + 2 }));
        }}
      >
        修改标题和字号
      </button>
      <button disabled={!h.inTransaction} onClick={h.commitTransaction}>
        提交编辑事务
      </button>
      <button disabled={!h.inTransaction} onClick={h.rollbackTransaction}>
        回滚编辑事务
      </button>
      <button disabled={!h.canUndo} onClick={h.undo}>
        撤销整个事务
      </button>
      <output>
        {h.value.title} · {h.value.size}px ·{" "}
        {h.inTransaction ? "编辑中" : "已提交"} · 历史 {h.past.length}
      </output>
    </>
  );
}

export default Enhanced2;
