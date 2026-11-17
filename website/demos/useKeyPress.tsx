import { useRef, useState } from "react";
import { useKeyPress } from "../../src";
export default function Demo() {
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(0);
  const scope = useRef<HTMLDivElement>(null);
  useKeyPress("k", () => setCount((n) => n + 1));
  useKeyPress("mod+s", () => setSaved((n) => n + 1), {
    scope,
    allowInInput: true,
    preventDefault: true,
    priority: 10,
  });
  return (
    <div className="demo-stack">
      <p>按 K 触发普通快捷键；输入框内不触发普通快捷键。</p>
      <output>已触发 {count} 次</output>
      <div ref={scope} className="notice">
        <label>
          快捷键作用域
          <input placeholder="聚焦后按 Ctrl+S / Cmd+S" />
        </label>
        <output>区域保存 {saved} 次</output>
      </div>
      <small>
        mod 在 Windows 映射 Ctrl，在 macOS 映射
        Cmd；高优先级绑定可独占匹配事件。
      </small>
    </div>
  );
}
