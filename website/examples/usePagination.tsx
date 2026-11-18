import { Scenario } from "./Scenario";
import Case1 from "./usePagination/Case1";
import Case1Source from "./usePagination/Case1.tsx?raw";
import Case2 from "./usePagination/Case2";
import Case2Source from "./usePagination/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="未知总数分页"
        description="不传 total，页数为未知，由服务或调用者决定是否还有下一页。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="总数减少与越界修正"
        description="先跳到最后一页，再减少总数或清空数据，观察页码限制。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
