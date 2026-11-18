import { Scenario } from "./Scenario";
import Case1 from "./useLongPress/Case1";
import Case1Source from "./useLongPress/Case1.tsx?raw";
import Case2 from "./useLongPress/Case2";
import Case2Source from "./useLongPress/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自定义时长与禁用"
        description="改变识别时长或禁用长按；键盘按钮调用同一个业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="移动阈值与主动取消"
        description="按住后移动超过 4px 会取消；取消按钮也可结束等待。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
