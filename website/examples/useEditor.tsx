import * as React from "react";
import { useEditor } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const editor = useEditor<{ id: number; title: string }>();
  return (
    <>
      <div className="demo-row">
        {["文章甲", "文章乙"].map((title, id) => (
          <button key={id} onClick={() => editor.edit({ id, title })}>
            {title}
          </button>
        ))}
      </div>
      {editor.isOpen && (
        <div className="notice">
          当前编辑：{editor.record?.title}
          <button onClick={editor.close}>收起记录</button>
        </div>
      )}
    </>
  );
}
function Case2() {
  const editor = useEditor<{ name: string }>();
  return (
    <>
      <button onClick={() => editor.edit({ name: "已有项目" })}>
        载入已有项目
      </button>
      <button onClick={editor.create}>切换新建项目</button>
      <button onClick={editor.close}>关闭项目面板</button>
      <output>
        模式 {editor.mode} · 记录 {editor.record?.name ?? "空"} ·{" "}
        {editor.isOpen ? "打开" : "关闭"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="从列表切换编辑对象"
        description="连续选择不同记录，面板显示最新记录；关闭不会删除原始数据。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="新建清空旧记录"
        description="先编辑，再进入新建模式，观察 record 变为 null。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
