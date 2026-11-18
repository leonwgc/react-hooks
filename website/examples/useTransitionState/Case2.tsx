import * as React from "react";

import { useTransitionState } from "../../../src";

function Case2() {
  const [open, setOpen] = React.useState(true);
  const s = useTransitionState(open, {
    appear: true,
    enterDuration: 400,
    exitDuration: 800,
  });
  return (
    <>
      <button onClick={() => setOpen(false)}>请求退出内容</button>
      <button onClick={() => setOpen(true)}>重新进入内容</button>
      <output>
        {s.phase} · {s.mounted ? "仍挂载" : "已卸载"}
      </output>
      {s.mounted && (
        <div
          className="notice transition-demo"
          data-phase={s.phase}
          style={{
            animationDuration: s.phase === "exiting" ? "800ms" : "400ms",
          }}
        >
          试着快速点击退出再进入。
        </div>
      )}
    </>
  );
}

export default Case2;
