import { Scenario } from "./Scenario";
import Case1 from "./useUrlState/Case1";
import Case1Source from "./useUrlState/Case1.tsx?raw";
import Case2 from "./useUrlState/Case2";
import Case2Source from "./useUrlState/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="多条件同步与删除"
        description="使用独立演示参数，批量写入并单独删除，保留其他查询参数与 hash 路由。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="浏览器前进与后退"
        description="push 为每次选择新增历史，可用浏览器后退恢复上一次 URL 状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
