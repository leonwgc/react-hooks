import { Scenario } from "./Scenario";
import Case1 from "./useTextareaAutoSize/Case1";
import Case1Source from "./useTextareaAutoSize/Case1.tsx?raw";
import Case2 from "./useTextareaAutoSize/Case2";
import Case2Source from "./useTextareaAutoSize/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="行数上限与内容收缩"
        description="输入或填入长内容，观察最大行数限制；清空后恢复最少行数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="禁用与手动重新测量"
        description="关闭后恢复原内联高度，启用后重新测量；手动 resize 可用于外部字体和样式变化。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
