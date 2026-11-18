import { Scenario } from "./Scenario";
import Case1 from "./useFocusWithin/Case1";
import Case1Source from "./useFocusWithin/Case1.tsx?raw";
import Case2 from "./useFocusWithin/Case2";
import Case2Source from "./useFocusWithin/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="聚焦提示与外部控件"
        description="在组内多个输入之间切换焦点不会退出区域，聚焦外部按钮会隐藏提示。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="两个独立焦点区域"
        description="每个区域独立追踪；从一个区域切换到另一个不会互相混淆。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
