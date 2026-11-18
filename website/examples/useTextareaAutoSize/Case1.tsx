import * as React from "react";

import { useTextareaAutoSize } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("");
  const [max, setMax] = React.useState(3);
  const size = useTextareaAutoSize(ref, text, { minRows: 1, maxRows: max });
  return (
    <>
      <label>
        最多显示行数
        <select value={max} onChange={(e) => setMax(Number(e.target.value))}>
          <option>3</option>
          <option>6</option>
        </select>
      </label>
      <label>
        行数限制文本
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 0, lineHeight: "22px", resize: "none" }}
        />
      </label>
      <button
        onClick={() =>
          setText(`一行
二行
三行
四行
五行`)
        }
      >
        填入五行
      </button>
      <button onClick={() => setText("")}>清空多行文本</button>
      <output>高度 {Math.round(size.height)}px</output>
    </>
  );
}

export default Case1;
