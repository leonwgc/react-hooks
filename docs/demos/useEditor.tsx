import { useEditor } from "../../src";

export default function Demo() {
  const editor = useEditor<{ name: string }>();
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={editor.create}>新建记录</button>
        <button
          className="secondary"
          onClick={() => editor.edit({ name: "示例文章" })}
        >
          编辑文章
        </button>
      </div>
      {editor.isOpen && (
        <div className="notice">
          <p>
            {editor.mode === "create"
              ? "新建模式"
              : `编辑：${editor.record?.name}`}
          </p>
          <button className="secondary" onClick={editor.close}>
            关闭编辑面板
          </button>
        </div>
      )}
    </div>
  );
}
