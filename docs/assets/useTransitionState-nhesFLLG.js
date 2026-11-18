var e=`import * as React from "react";
import { useTransitionState } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="不同进入和退出时长"
        description="进入较快、退出较慢，观察 exiting 阶段内容仍然存在。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="快速反向切换"
        description="退出未完成时重新打开会取消旧的卸载计时器，不会被旧任务意外移除。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};