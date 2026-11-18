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
      <Scenario
        title="动画结束与生命周期回调"
        description="实际 CSS 动画为 250ms，兜底为 1500ms；绑定 animationend 后会提前完成并记录回调。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="缺失结束事件的兜底"
        description="不播放 CSS 动画，也不会触发结束事件；阶段仍按 600ms 兜底完成，快速反向切换取消旧计时。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};