import * as React from "react";

import { useLongPress } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(0);
  const p = useLongPress(() => setCount((n) => n + 1), {
    delay: 900,
    threshold: 4,
  });
  return (
    <>
      <button {...p.bind} style={{ touchAction: "none" }}>
        按住此处，移动后取消
      </button>
      <button onClick={p.cancel}>取消长按等待</button>
      <button onClick={() => setCount((n) => n + 1)}>键盘等价触发</button>
      <output>
        {p.pressing ? "识别中" : "未按住"} · {count} 次
      </output>
    </>
  );
}

export default Case2;
