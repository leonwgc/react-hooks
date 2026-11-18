import * as React from "react";

import { useEventListener } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useEventListener("click", () => setCount((n) => n + 1), enabled ? ref : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停监听" : "恢复监听"}
      </button>
      <button ref={ref}>触发原生点击</button>
      <output>收到 {count} 次</output>
    </>
  );
}

export default Case1;
