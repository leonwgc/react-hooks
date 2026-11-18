import * as React from "react";

import { useMutationObserver } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    childList: true,
    subtree: true,
  });
  return (
    <>
      <div ref={ref} className="notice" />
      <button
        onClick={() => {
          const node = document.createElement("p");
          node.textContent = "外部段落";
          ref.current?.append(node);
        }}
      >
        追加外部段落
      </button>
      <button onClick={() => ref.current?.replaceChildren()}>
        清空外部内容
      </button>
      <output>DOM 变更 {count} 条</output>
    </>
  );
}

export default Case2;
