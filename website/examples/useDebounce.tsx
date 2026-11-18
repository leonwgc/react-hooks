import { Scenario } from "./Scenario";
import Case1 from "./useDebounce/Case1";
import Case1Source from "./useDebounce/Case1.tsx?raw";
import Case2 from "./useDebounce/Case2";
import Case2Source from "./useDebounce/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="可调整等待时间"
        description="修改等待时间并连续输入，比较即时值与防抖值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="对象条件合并查询"
        description="多个条件组成同一个对象，停止修改后一起成为查询快照。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
