var e=`import * as React from "react";
import { useUndoRedo } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="有限历史与分支丢弃"
        description="最多保留两步；撤销后写入新值会清除重做分支。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="替换快照与清除历史"
        description="replace 不新增撤销步骤；clear 保留当前值并清空历史。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};