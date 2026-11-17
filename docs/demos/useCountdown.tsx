import { useState } from "react";
import { useCountdown } from "../../src";

export default function Demo() {
  const [target, setTarget] = useState<number | null>(null);
  const countdown = useCountdown(target);
  return (
    <div className="demo-row">
      <button
        disabled={countdown.remaining > 0}
        onClick={() => setTarget(Date.now() + 10000)}
      >
        {countdown.remaining > 0
          ? `${countdown.seconds}s 后重试`
          : "发送验证码（演示）"}
      </button>
      <button className="secondary" onClick={() => setTarget(null)}>
        重置
      </button>
    </div>
  );
}
