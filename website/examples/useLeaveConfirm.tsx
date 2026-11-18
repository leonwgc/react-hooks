import { Scenario } from "./Scenario";
import Case1 from "./useLeaveConfirm/Case1";
import Case1Source from "./useLeaveConfirm/Case1.tsx?raw";
import Case2 from "./useLeaveConfirm/Case2";
import Case2Source from "./useLeaveConfirm/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自定义确认与取消"
        description="以页内选择代替浏览器弹窗，分别体验允许离开和继续编辑。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="保存后无需确认"
        description="dirty 为 false 时跳过确认；修改后恢复保护，异步确认完成才执行导航。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
