import * as React from "react";

import { useMutationObserver } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);
  useMutationObserver(ref, (records) => setCount((n) => n + records.length), {
    attributes: true,
    attributeFilter: ["data-status"],
  });
  return (
    <>
      <div ref={ref} className="notice">
        外部插件宿主
      </div>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-status", String(Date.now()))
        }
      >
        修改观察属性
      </button>
      <button
        onClick={() =>
          ref.current?.setAttribute("data-other", String(Date.now()))
        }
      >
        修改忽略属性
      </button>
      <output>观察到 {count} 条属性变化</output>
    </>
  );
}

export default Case1;
