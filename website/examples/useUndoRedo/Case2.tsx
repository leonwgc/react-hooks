import { useUndoRedo } from "../../../src";

function Case2() {
  const h = useUndoRedo("起点");
  return (
    <>
      <button onClick={() => h.set("已提交")}>提交新快照</button>
      <button onClick={() => h.set("修订当前", { replace: true })}>
        替换当前快照
      </button>
      <button onClick={h.clear}>清除撤销历史</button>
      <button disabled={!h.canUndo} onClick={h.undo}>
        撤销快照
      </button>
      <output>
        {h.value} · 可撤销 {String(h.canUndo)}
      </output>
    </>
  );
}

export default Case2;
