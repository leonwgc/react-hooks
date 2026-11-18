import { useState } from "react";
import { useTransitionState } from "../../src";
export default function Demo() {
  const [open, setOpen] = useState(false);
  const transition = useTransitionState(open, {
    enterDuration: 250,
    exitDuration: 250,
  });
  return (
    <div className="demo-stack">
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "关闭过渡面板" : "打开过渡面板"}
      </button>
      <output>阶段：{transition.phase}</output>
      {transition.mounted && (
        <div className="notice transition-demo" data-phase={transition.phase}>
          退出动画结束后才卸载这段内容。
        </div>
      )}
    </div>
  );
}
