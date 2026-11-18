import { Scenario } from "./Scenario";
import Case1 from "./useClickOutside/Case1";
import Case1Source from "./useClickOutside/Case1.tsx?raw";
import Case2 from "./useClickOutside/Case2";
import Case2Source from "./useClickOutside/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="暂停外部关闭"
        description="关闭监听后点击外部区域不再关闭面板。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="记录外部点击来源"
        description="读取原生 PointerEvent，区分目标内部和外部触发。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
