import { useState } from "react";
import { useDocumentTitle } from "../../src";
export default function Demo() {
  const [title, setTitle] = useState("Hooks 标题演示");
  useDocumentTitle(title);
  return (
    <div className="demo-stack">
      <label>
        浏览器标题
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <p>查看浏览器标签标题；离开这个 Hook 页面会恢复原始标题。</p>
    </div>
  );
}
