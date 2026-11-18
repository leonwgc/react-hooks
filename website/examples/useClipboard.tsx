import { Scenario } from "./Scenario";
import Case1 from "./useClipboard/Case1";
import Case1Source from "./useClipboard/Case1.tsx?raw";
import Case2 from "./useClipboard/Case2";
import Case2Source from "./useClipboard/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="复制用户编辑的文本"
        description="复制当前输入，失败时保留文本供手动选择。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="复制结构化数据"
        description="先序列化业务对象，再复制可读的 JSON 文本。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
