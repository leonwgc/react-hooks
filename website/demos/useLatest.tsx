import { useEffect, useRef, useState } from "react";
import { useLatest } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  const latest = useLatest(count);
  const [message, setMessage] = useState("点击开始读取，然后修改计数");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={() => setCount((n) => n + 1)}>计数 {count}</button>
        <button
          className="secondary"
          onClick={() => {
            clearTimeout(timer.current);
            timer.current = setTimeout(
              () => setMessage(`最新计数：${latest.current}`),
              2000,
            );
          }}
        >
          2 秒后读取
        </button>
      </div>
      <output>{message}</output>
    </div>
  );
}
