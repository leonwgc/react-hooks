import { useEditor } from "../../../src";

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

export default Case2;
