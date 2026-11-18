import { Scenario } from "./Scenario";
import Case1 from "./useMutationObserver/Case1";
import Case1Source from "./useMutationObserver/Case1.tsx?raw";
import Case2 from "./useMutationObserver/Case2";
import Case2Source from "./useMutationObserver/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="观察指定属性"
        description="仅关注 data-status 的变化，其他属性变化不会计数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="观察子树与删除节点"
        description="添加嵌套节点或清空宿主，观察 childList 和 subtree 的记录。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
