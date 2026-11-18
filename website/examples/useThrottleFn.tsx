import { Scenario } from "./Scenario";
import Case1 from "./useThrottleFn/Case1";
import Case1Source from "./useThrottleFn/Case1.tsx?raw";
import Case2 from "./useThrottleFn/Case2";
import Case2Source from "./useThrottleFn/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="拖动数值预览"
        description="滑块立即更新，节流处理值最多按固定间隔发布，并保留最后的数值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="取消与重新开始"
        description="连续提交会保留尾沿；cancel 清除尾沿并重置执行窗口。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
