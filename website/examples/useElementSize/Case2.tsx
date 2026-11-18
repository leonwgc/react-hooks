import * as React from "react";

import { useElementSize } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState(1);
  const size = useElementSize(ref);
  return (
    <>
      <button onClick={() => setRows((n) => (n === 4 ? 1 : n + 1))}>
        增加段落或重置
      </button>
      <div ref={ref}>
        {Array.from({ length: rows }, (_, i) => (
          <p key={i}>第 {i + 1} 段动态内容</p>
        ))}
      </div>
      <output>内容高度 {Math.round(size.height)}px</output>
    </>
  );
}

export default Case2;
