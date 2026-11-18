import { useUndoRedo } from "../../../src";

function Enhanced1() {
  const h = useUndoRedo("", { mergeWindow: 800 });
  return (
    <>
      <label>
        合并输入
        <textarea
          value={h.value}
          onChange={(e) =>
            h.set(e.target.value, { group: "text", label: "编辑正文" })
          }
        />
      </label>
      <button disabled={!h.canUndo} onClick={h.undo}>
        撤销连续输入
      </button>
      <button disabled={!h.canRedo} onClick={h.redo}>
        重做连续输入
      </button>
      <output>
        历史 {h.past.length} · 撤销 {h.undoLabel ?? "无"} · 重做{" "}
        {h.redoLabel ?? "无"}
      </output>
    </>
  );
}

export default Enhanced1;
