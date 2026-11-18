import * as React from "react";

import { useTransitionState } from "../../../src";

function Enhanced1() {
  const [open, setOpen] = React.useState(false),
    [events, setEvents] = React.useState<string[]>([]);
  const log = (name: string) => setEvents((e) => [...e, name]);
  const s = useTransitionState(open, {
    endEvent: "animationend",
    enterDuration: 1500,
    exitDuration: 1500,
    onEnter: () => log("开始进入"),
    onEntered: () => log("进入完成"),
    onExit: () => log("开始退出"),
    onExited: () => log("退出完成"),
  });
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>切换事件驱动动画</button>
      <output>{s.phase}</output>
      {s.mounted && (
        <div
          {...s.bind}
          className="notice transition-demo"
          data-phase={s.phase}
        >
          250ms 实际动画
        </div>
      )}
      <p>{events.join(" → ")}</p>
    </>
  );
}

export default Enhanced1;
