import * as React from "react";

import { useTextSelection } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  return (
    <>
      <p ref={ref}>这段内容可被引用到笔记中。</p>
      <button
        onClick={() => {
          if (!ref.current) return;
          const range = document.createRange();
          range.selectNodeContents(ref.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }}
      >
        选中整段内容
      </button>
      <button onClick={s.clear}>取消段落选中</button>
      <output>{s.text || "无选区"}</output>
    </>
  );
}

export default Case1;
