import { Scenario } from "./Scenario";
import Case1 from "./useGesture/Case1";
import Case1Source from "./useGesture/Case1.tsx?raw";
import Case2 from "./useGesture/Case2";
import Case2Source from "./useGesture/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="受限拖动轴与取消"
        description="只输出垂直位移，水平分量保持为零；取消后保留位移，重置归零。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="禁用手势与业务等价按钮"
        description="禁用后不再开始新手势，业务操作仍可通过键盘按钮完成。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
