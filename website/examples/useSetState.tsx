import { Scenario } from "./Scenario";
import Case1 from "./useSetState/Case1";
import Case1Source from "./useSetState/Case1.tsx?raw";
import Case2 from "./useSetState/Case2";
import Case2Source from "./useSetState/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="多字段筛选条件"
        description="修改一个字段会保留其他字段，支持一次提交多个字段。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="嵌套对象与连续更新"
        description="显式复制嵌套结构；连续两次函数更新会基于前一次结果累计。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
