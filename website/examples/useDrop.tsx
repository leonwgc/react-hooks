import { Scenario } from "./Scenario";
import Case1 from "./useDrop/Case1";
import Case1Source from "./useDrop/Case1.tsx?raw";
import Case2 from "./useDrop/Case2";
import Case2Source from "./useDrop/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="禁用接收区域"
        description="禁用后不接受拖放；启用后拖入文字或使用按钮完成同一业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="文件元信息与业务校验"
        description="接收到文件后展示名称、大小和类型；此示例只接受小于 1MB 的文件，不上传。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
