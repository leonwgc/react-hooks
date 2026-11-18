import * as React from "react";

import { useKeyPress } from "../../../src";

function Case1() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = React.useState(true);
  const [count, setCount] = React.useState(0);
  useKeyPress("enter", () => setCount((n) => n + 1), { scope, enabled });
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "暂停快捷键" : "启用快捷键"}
      </button>
      <div ref={scope}>
        <button>聚焦这里后按 Enter</button>
      </div>
      <output>局部命令 {count} 次</output>
    </>
  );
}

export default Case1;
