import { useRef } from "react";
import { useTextSelection } from "../../src";
export default function Demo() {
  const ref = useRef<HTMLParagraphElement>(null);
  const selection = useTextSelection(ref);
  return (
    <div className="demo-stack">
      <p ref={ref} tabIndex={0}>
        选中这段文字的一部分，体验阅读批注与引用功能。此处只跟踪当前段落内的选区。
      </p>
      <output>选中文字：{selection.text || "暂无"}</output>
      <button onClick={selection.clear}>清除选区</button>
    </div>
  );
}
