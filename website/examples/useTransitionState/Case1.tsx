import * as React from "react";

import { useTransitionState } from "../../../src";

function Case1() {
  const [open, setOpen] = React.useState(false);
  const s = useTransitionState(open, { enterDuration: 150, exitDuration: 600 });
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>切换不同时长提示</button>
      <output>{s.phase}</output>
      {s.mounted && (
        <div
          className="notice transition-demo"
          data-phase={s.phase}
          style={{
            animationDuration: s.phase === "exiting" ? "600ms" : "150ms",
          }}
        >
          这条提示会慢慢退出。
        </div>
      )}
    </>
  );
}

export default Case1;
