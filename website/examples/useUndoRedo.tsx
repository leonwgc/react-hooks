import * as React from "react";
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
      <Scenario
        title="连续输入合并与标签"
        description="800ms 内的连续输入归为一次撤销，停顿或撤销会打断合并；显示下一次操作标签。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="事务提交与回滚"
        description="事务中修改多个属性，提交只生成一个撤销步骤；回滚恢复事务前的值和历史。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
