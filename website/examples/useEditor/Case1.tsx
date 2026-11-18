import { useEditor } from "../../../src";

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

export default Case1;
