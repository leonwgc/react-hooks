import { Scenario } from "./Scenario";
import Case1 from "./useLocalStorageState/Case1";
import Case1Source from "./useLocalStorageState/Case1.tsx?raw";
import Case2 from "./useLocalStorageState/Case2";
import Case2Source from "./useLocalStorageState/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="对象状态与函数更新"
        description="将对象保存到独立演示键，累计更新后可清除，刷新页面观察持久化。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="同页两个实例同步"
        description="两个 Hook 使用同一个独立键，任一实例写入后另一个也会更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
