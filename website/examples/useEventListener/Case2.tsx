import * as React from "react";

import { useEventListener } from "../../../src";

function Case2() {
  const parent = React.useRef<HTMLDivElement>(null);
  const child = React.useRef<HTMLButtonElement>(null);
  const [log, setLog] = React.useState<string[]>([]);
  useEventListener(
    "click",
    () => setLog((s) => [...s.slice(-5), "父捕获"]),
    parent,
    { capture: true },
  );
  useEventListener("click", () => setLog((s) => [...s, "子点击"]), child);
  return (
    <>
      <div ref={parent}>
        <button ref={child}>观察事件顺序</button>
      </div>
      <button onClick={() => setLog([])}>清空事件记录</button>
      <output>{log.join(" → ") || "等待点击"}</output>
    </>
  );
}

export default Case2;
