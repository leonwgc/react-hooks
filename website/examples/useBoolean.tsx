import { Scenario } from "./Scenario";
import Case1 from "./useBoolean/Case1";
import Case1Source from "./useBoolean/Case1.tsx?raw";
import Case2 from "./useBoolean/Case2";
import Case2Source from "./useBoolean/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="密码显示开关"
        description="切换输入框类型，观察同一布尔状态如何同时控制按钮文案和密码可见性。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="显式设置与函数更新"
        description="使用 setTrue、setFalse 与 setValue，重复启用不会反转状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
