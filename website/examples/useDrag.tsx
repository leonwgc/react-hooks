import { Scenario } from "./Scenario";
import Case1 from "./useDrag/Case1";
import Case1Source from "./useDrag/Case1.tsx?raw";
import Case2 from "./useDrag/Case2";
import Case2Source from "./useDrag/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自定义 MIME 数据"
        description="拖放双方约定同一个数据类型，传递 JSON 文本并解析；按钮提供等价业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="只读时禁用拖动"
        description="切换 disabled 后 draggable 状态变化，目标区域继续支持正常接收。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
