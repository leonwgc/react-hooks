import { useRef, useState } from "react";
import { useMemoizedFn } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("尚未读取");
  const read = useMemoizedFn(() => setMessage(`最新值为 ${count}`));
  const first = useRef(read);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={() => setCount((n) => n + 1)}>计数 {count}</button>
        <button className="secondary" onClick={read}>
          读取最新值
        </button>
      </div>
      <output>
        {message} · 函数引用{first.current === read ? "保持稳定" : "已变化"}
      </output>
    </div>
  );
}
