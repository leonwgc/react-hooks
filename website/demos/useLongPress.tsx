import { useState } from "react";
import { useLongPress } from "../../src";
export default function Demo() {
  const [count, setCount] = useState(0);
  const action = () => setCount((n) => n + 1);
  const press = useLongPress(action, { delay: 600 });
  return (
    <div className="demo-stack">
      <button {...press.bind} style={{ touchAction: "none" }}>
        长按 600ms · {press.pressing ? "按住中" : "等待按下"}
      </button>
      <output>已触发 {count} 次</output>
      <button onClick={action}>键盘等价操作：触发一次</button>
      <small>拖动超过 10px 或松开会取消等待。</small>
    </div>
  );
}
