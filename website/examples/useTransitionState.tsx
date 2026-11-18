import { Scenario } from "./Scenario";
import Case1 from "./useTransitionState/Case1";
import Case1Source from "./useTransitionState/Case1.tsx?raw";
import Case2 from "./useTransitionState/Case2";
import Case2Source from "./useTransitionState/Case2.tsx?raw";
import Enhanced1 from "./useTransitionState/Enhanced1";
import Enhanced1Source from "./useTransitionState/Enhanced1.tsx?raw";
import Enhanced2 from "./useTransitionState/Enhanced2";
import Enhanced2Source from "./useTransitionState/Enhanced2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="不同进入和退出时长"
        description="进入较快、退出较慢，观察 exiting 阶段内容仍然存在。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="快速反向切换"
        description="退出未完成时重新打开会取消旧的卸载计时器，不会被旧任务意外移除。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="动画结束与生命周期回调"
        description="实际 CSS 动画为 250ms，兜底为 1500ms；绑定 animationend 后会提前完成并记录回调。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="缺失结束事件的兜底"
        description="不播放 CSS 动画，也不会触发结束事件；阶段仍按 600ms 兜底完成，快速反向切换取消旧计时。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
