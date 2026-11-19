import { Scenario } from "./Scenario";
import Case1 from "./useWatch/Case1";
import Case1Source from "./useWatch/Case1.tsx?raw";
import Case2 from "./useWatch/Case2";
import Case2Source from "./useWatch/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="条件显示与渲染计数"
        description="只订阅配送方式，选择快递时才显示地址字段；修改备注不会让条件区域重渲染。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="订阅整个表单生成预览"
        description="省略 path 订阅全部值，实时生成订单摘要；表单根组件本身保持不重渲染。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
