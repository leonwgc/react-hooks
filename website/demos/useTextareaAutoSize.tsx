import { useRef, useState } from "react";
import { useTextareaAutoSize } from "../../src";
export default function Demo() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const size = useTextareaAutoSize(ref, text, { minRows: 2, maxRows: 5 });
  return (
    <div className="demo-stack">
      <label>
        自增高留言
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 0, resize: "none", lineHeight: "22px" }}
          placeholder="输入多行，最多显示五行"
        />
      </label>
      <small>
        初始显示两行，输入超过两行后自动增高；最多显示五行，再多则内部滚动。
      </small>
      <button
        onClick={() =>
          setText(
            Array.from({ length: 8 }, (_, i) => `演示内容第 ${i + 1} 行`).join(
              "\n",
            ),
          )
        }
      >
        填入八行文本
      </button>
      <button onClick={() => setText("")}>清空留言</button>
      <output>应用高度 {Math.round(size.height)}px</output>
    </div>
  );
}
