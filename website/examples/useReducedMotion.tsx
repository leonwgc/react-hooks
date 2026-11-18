import { Scenario } from "./Scenario";
import Case1 from "./useReducedMotion/Case1";
import Case1Source from "./useReducedMotion/Case1.tsx?raw";
import Case2 from "./useReducedMotion/Case2";
import Case2Source from "./useReducedMotion/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="按系统偏好切换过渡"
        description="展开面板时，系统要求减少动画则立即切换；可在系统设置或浏览器媒体模拟中改变偏好。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="交互触发的动画替代"
        description="完整模式移动位置，减少动态模式仅改变文字和颜色，不强制开启运动。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
