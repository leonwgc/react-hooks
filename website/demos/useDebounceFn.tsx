import { useState } from "react";
import { useDebounceFn } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  const action = useDebounceFn(() => setCount((n) => n + 1), 700);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={action.run}>连续点击</button>
        <button className="secondary" onClick={action.flush}>
          立即执行
        </button>
        <button className="secondary" onClick={action.cancel}>
          取消
        </button>
      </div>
      <output>停止点击 700ms 后执行 · 已执行 {count} 次</output>
    </div>
  );
}
