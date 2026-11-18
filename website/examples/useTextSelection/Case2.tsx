import * as React from "react";

import { useTextSelection } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  const [quote, setQuote] = React.useState("尚未引用");
  return (
    <>
      <p ref={ref}>受跟踪段落：选中这里可以生成引用。</p>
      <p>外部段落：选中这里不会作为区域内选区返回。</p>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setQuote(s.text || "请先选中受跟踪文字")}
      >
        保存选中引用
      </button>
      <output>{quote}</output>
    </>
  );
}

export default Case2;
