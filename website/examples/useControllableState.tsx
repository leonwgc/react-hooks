import { Scenario } from "./Scenario";
import Case1 from "./useControllableState/Case1";
import Case1Source from "./useControllableState/Case1.tsx?raw";
import Case2 from "./useControllableState/Case2";
import Case2Source from "./useControllableState/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="父级控制的评分"
        description="子级提出新值，由父级 onChange 写回；父级也可以直接重置值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="受控值需要回写"
        description="切换是否接受子组件的变更，观察回调通知和实际受控值的区别。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
