import { Scenario } from "./Scenario";
import Case1 from "./useAnimate/Case1";
import Case1Source from "./useAnimate/Case1.tsx?raw";
import Case2 from "./useAnimate/Case2";
import Case2Source from "./useAnimate/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="淡入反馈与完成状态"
        description="播放短暂淡入动画，完成后状态变为 finished，取消可恢复初始样式。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="往返动画与重播"
        description="使用 alternate 和有限 iterations；运行中重播会取消上一段动画。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
