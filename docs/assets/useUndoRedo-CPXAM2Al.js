import{t as e}from"./Scenario-ApRSINdu.js";import{s as t}from"./interaction-a07diKrt.js";import{D as n}from"./index-C6jdXK2z.js";var r=n();function i(){let e=t(0,{limit:2});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>e.set(e=>e+1),children:`数值加一`}),(0,r.jsx)(`button`,{disabled:!e.canUndo,onClick:e.undo,children:`退回一步`}),(0,r.jsx)(`button`,{disabled:!e.canRedo,onClick:e.redo,children:`重做一步`}),(0,r.jsxs)(`output`,{children:[`当前 `,e.value,` · 可重做 `,String(e.canRedo)]})]})}var a=`import { useUndoRedo } from "../../../src";

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
`;function o(){let e=t(`起点`);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>e.set(`已提交`),children:`提交新快照`}),(0,r.jsx)(`button`,{onClick:()=>e.set(`修订当前`,{replace:!0}),children:`替换当前快照`}),(0,r.jsx)(`button`,{onClick:e.clear,children:`清除撤销历史`}),(0,r.jsx)(`button`,{disabled:!e.canUndo,onClick:e.undo,children:`撤销快照`}),(0,r.jsxs)(`output`,{children:[e.value,` · 可撤销 `,String(e.canUndo)]})]})}var s=`import { useUndoRedo } from "../../../src";

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
`;function c(){let e=t(``,{mergeWindow:800});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`label`,{children:[`合并输入`,(0,r.jsx)(`textarea`,{value:e.value,onChange:t=>e.set(t.target.value,{group:`text`,label:`编辑正文`})})]}),(0,r.jsx)(`button`,{disabled:!e.canUndo,onClick:e.undo,children:`撤销连续输入`}),(0,r.jsx)(`button`,{disabled:!e.canRedo,onClick:e.redo,children:`重做连续输入`}),(0,r.jsxs)(`output`,{children:[`历史 `,e.past.length,` · 撤销 `,e.undoLabel??`无`,` · 重做`,` `,e.redoLabel??`无`]})]})}var l=`import { useUndoRedo } from "../../../src";

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
`;function u(){let e=t({title:`原始标题`,size:12});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{disabled:e.inTransaction,onClick:()=>e.beginTransaction(`调整卡片`),children:`开始编辑事务`}),(0,r.jsx)(`button`,{disabled:!e.inTransaction,onClick:()=>{e.set(e=>({...e,title:`新版标题`})),e.set(e=>({...e,size:e.size+2}))},children:`修改标题和字号`}),(0,r.jsx)(`button`,{disabled:!e.inTransaction,onClick:e.commitTransaction,children:`提交编辑事务`}),(0,r.jsx)(`button`,{disabled:!e.inTransaction,onClick:e.rollbackTransaction,children:`回滚编辑事务`}),(0,r.jsx)(`button`,{disabled:!e.canUndo,onClick:e.undo,children:`撤销整个事务`}),(0,r.jsxs)(`output`,{children:[e.value.title,` · `,e.value.size,`px ·`,` `,e.inTransaction?`编辑中`:`已提交`,` · 历史 `,e.past.length]})]})}var d=`import { useUndoRedo } from "../../../src";

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
`;function f(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`有限历史与分支丢弃`,description:`最多保留两步；撤销后写入新值会清除重做分支。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`替换快照与清除历史`,description:`replace 不新增撤销步骤；clear 保留当前值并清空历史。`,children:(0,r.jsx)(o,{})}),(0,r.jsx)(e,{source:l,title:`连续输入合并与标签`,description:`800ms 内的连续输入归为一次撤销，停顿或撤销会打断合并；显示下一次操作标签。`,children:(0,r.jsx)(c,{})}),(0,r.jsx)(e,{source:d,title:`事务提交与回滚`,description:`事务中修改多个属性，提交只生成一个撤销步骤；回滚恢复事务前的值和历史。`,children:(0,r.jsx)(u,{})})]})}export{f as default};