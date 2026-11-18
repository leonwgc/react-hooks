import { Scenario } from "./Scenario";
import Case1 from "./useSpring/Case1";
import Case1Source from "./useSpring/Case1.tsx?raw";
import Case2 from "./useSpring/Case2";
import Case2Source from "./useSpring/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="调整阻尼观察回弹"
        description="低阻尼会有更明显回弹；高阻尼更平缓，系统减少动态效果时直接到达目标。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="暂停、继续与立即到达"
        description="暂停保留当前值；restart 从当前位置继续追踪目标，finish 直接吸附。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
