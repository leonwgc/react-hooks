import { Scenario } from "./Scenario";
import Case1 from "./useCountdown/Case1";
import Case1Source from "./useCountdown/Case1.tsx?raw";
import Case2 from "./useCountdown/Case2";
import Case2Source from "./useCountdown/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="截止回调与重新启动"
        description="设置三秒目标，结束后记录回调次数；可提前取消或重新计时。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="过期目标与延长截止"
        description="传入过去时间立即得到零；新目标会重新计算剩余时间。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
