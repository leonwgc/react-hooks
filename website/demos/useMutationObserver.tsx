import { useRef, useState } from "react";
import { useMutationObserver } from "../../src";
export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const observer = useMutationObserver(
    ref,
    (records) => setCount((n) => n + records.length),
    { childList: true },
  );
  return (
    <div className="demo-stack">
      <div ref={ref} className="notice" />
      <button
        onClick={() => {
          const node = document.createElement("span");
          node.textContent = " 外部节点 ";
          ref.current?.appendChild(node);
        }}
      >
        模拟第三方插入 DOM
      </button>
      <output>观察到 {count} 条变更</output>
      {!!observer.error && <p role="alert">{String(observer.error)}</p>}
      <small>容器内容由外部 DOM 操作维护，不与 React 子节点混用。</small>
    </div>
  );
}
