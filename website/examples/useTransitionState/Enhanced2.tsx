import * as React from "react";

import { useTransitionState } from "../../../src";

function Enhanced2() {
  const [open, setOpen] = React.useState(false);
  const s = useTransitionState(open, { enterDuration: 600, exitDuration: 600 });
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>切换无动画内容</button>
      <output>
        {s.phase} · {s.mounted ? "已挂载" : "已卸载"}
      </output>
      {s.mounted && (
        <div {...s.bind} className="notice">
          没有 CSS 动画，仍能正确退出。
        </div>
      )}
    </>
  );
}

export default Enhanced2;
