import { Scenario } from "./Scenario";
import Case1 from "./useRafLoop/Case1";
import Case1Source from "./useRafLoop/Case1.tsx?raw";
import Case2 from "./useRafLoop/Case2";
import Case2Source from "./useRafLoop/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="基于 delta 的速度控制"
        description="改变每秒速率后，进度仍按真实帧间隔推进，开始和停止均可重复调用。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="帧间隔采样"
        description="实时采样 delta 并展示近似帧率；停止后保持最后一次采样结果。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
