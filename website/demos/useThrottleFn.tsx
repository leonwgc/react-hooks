import { useState } from "react";
import { useThrottleFn } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  const action = useThrottleFn(() => setCount((n) => n + 1), 1000);
  return (
    <div className="demo-stack">
      <button onClick={action.run}>连续点击，每秒最多执行一次</button>
      <output>已执行 {count} 次，保留最后一次调用</output>
    </div>
  );
}
