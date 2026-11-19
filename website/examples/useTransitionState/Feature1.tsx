import * as React from "react";

import { useTransitionState } from "../../../src";

function Panel({ open, preEnter }: { open: boolean; preEnter: boolean }) {
  const s = useTransitionState(open, {
    preEnter,
    enterDuration: 400,
    exitDuration: 400,
    propertyName: "opacity",
  });
  return (
    <div>
      <p>
        {preEnter ? "开启 preEnter" : "未开启 preEnter"}：
        <output>{s.phase}</output>
      </p>
      {s.mounted && (
        <div {...s.bind} className="notice pre-enter-demo" data-phase={s.phase}>
          {preEnter ? "先挂载起始样式，再淡入" : "进入时直接出现"}
        </div>
      )}
    </div>
  );
}

function Feature1() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "隐藏两个面板" : "显示两个面板"}
      </button>
      <div className="demo-row">
        <Panel open={open} preEnter={false} />
        <Panel open={open} preEnter />
      </div>
    </>
  );
}

export default Feature1;
