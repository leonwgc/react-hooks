import { useState } from "react";
import { useInterval } from "../../src";

export default function Demo() {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  useInterval(() => setCount((n) => n + 1), active ? 1000 : null);
  return (
    <div className="demo-row">
      <button onClick={() => setActive((v) => !v)}>
        {active ? "暂停" : "开始"}
      </button>
      <output>{count} 秒</output>
    </div>
  );
}
