import * as React from "react";

import { useLongPress } from "../../../src";

function Feature1() {
  const [clicks, setClicks] = React.useState(0);
  const [presses, setPresses] = React.useState<string[]>([]);
  const press = useLongPress(
    (event) =>
      setPresses((list) => [
        ...list,
        `长按 ${event.currentTarget.dataset.name ?? "未知"}`,
      ]),
    { delay: 600 },
  );
  return (
    <>
      <button
        {...press.bind}
        data-name="删除按钮"
        onClick={() => setClicks((n) => n + 1)}
      >
        短按计数，长按 600ms 触发菜单
      </button>
      <output>
        点击 {clicks} 次 · {presses.join("、") || "尚未长按"}
      </output>
      <p>长按结束后松手不会再额外触发一次点击；回调中可读取 currentTarget。</p>
    </>
  );
}

export default Feature1;
