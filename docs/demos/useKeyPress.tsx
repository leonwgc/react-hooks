import { useState } from "react";
import { useKeyPress } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  useKeyPress("k", () => setCount((n) => n + 1));
  return (
    <div className="demo-stack">
      <p>
        按键盘 <kbd>K</kbd> 触发快捷操作。
      </p>
      <output>已触发 {count} 次</output>
      <label>
        输入框内不会触发
        <input placeholder="在这里按 k 试试" />
      </label>
    </div>
  );
}
