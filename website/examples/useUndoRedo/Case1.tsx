import { useUndoRedo } from "../../../src";

function Case1() {
  const h = useUndoRedo(0, { limit: 2 });
  return (
    <>
      <button onClick={() => h.set((n) => n + 1)}>数值加一</button>
      <button disabled={!h.canUndo} onClick={h.undo}>
        退回一步
      </button>
      <button disabled={!h.canRedo} onClick={h.redo}>
        重做一步
      </button>
      <output>
        当前 {h.value} · 可重做 {String(h.canRedo)}
      </output>
    </>
  );
}

export default Case1;
