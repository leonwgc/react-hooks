import { Scenario } from "./Scenario";
import Case1 from "./useDirty/Case1";
import Case1Source from "./useDirty/Case1.tsx?raw";
import Case2 from "./useDirty/Case2";
import Case2Source from "./useDirty/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="嵌套表单快照"
        description="默认深比较对象内容；恢复原始字段后会重新变为未修改状态。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="自定义比较规则"
        description="忽略首尾空格与大小写，只在有意义的内容变化时提示。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
