import { useState } from "react";
import { useAsyncAction } from "../../src";

export default function Demo() {
  const [saved, setSaved] = useState(0);
  const action = useAsyncAction(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaved((n) => n + 1);
  });
  return (
    <div className="demo-row">
      <button
        disabled={action.loading}
        onClick={() => void action.run().catch(() => {})}
      >
        {action.loading ? "保存中…" : "保存记录"}
      </button>
      <output>已保存 {saved} 次，进行中的重复调用共用同一个 Promise。</output>
    </div>
  );
}
