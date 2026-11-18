import { Scenario } from "./Scenario";
import Case1 from "./useSteps/Case1";
import Case1Source from "./useSteps/Case1.tsx?raw";
import Case2 from "./useSteps/Case2";
import Case2Source from "./useSteps/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="异步校验与取消"
        description="等待模拟校验时可取消；取消后即使旧服务结束，也不会跳到下一步。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="步骤数量与跳转边界"
        description="指定索引跳转，减少总步骤数后当前索引会限制到有效范围。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
