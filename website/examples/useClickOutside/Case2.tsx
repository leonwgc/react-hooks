import * as React from "react";

import { useClickOutside } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [log, setLog] = React.useState("尚未外部点击");
  useClickOutside(ref, (e) =>
    setLog(
      "外部目标：" +
        (e.target instanceof HTMLElement ? e.target.tagName : "未知"),
    ),
  );
  return (
    <>
      <div ref={ref} className="notice">
        <button>内部按钮不会触发</button>
      </div>
      <button>外部按钮触发记录</button>
      <output>{log}</output>
    </>
  );
}

export default Case2;
