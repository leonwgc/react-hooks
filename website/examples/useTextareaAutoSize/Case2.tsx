import * as React from "react";

import { useTextareaAutoSize } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("可以调整的文本域");
  const [enabled, setEnabled] = React.useState(true);
  const size = useTextareaAutoSize(ref, text, { enabled, minRows: 2 });
  return (
    <>
      <label>
        可暂停自增高
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ height: 100, minHeight: 0, lineHeight: "22px" }}
        />
      </label>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用自增高" : "启用自增高"}
      </button>
      <button onClick={size.resize}>手动测量文本域</button>
      <output>
        {enabled ? "自动模式" : "原始 100px 高度"} · {Math.round(size.height)}px
      </output>
    </>
  );
}

export default Case2;
