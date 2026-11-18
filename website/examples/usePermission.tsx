import { Scenario } from "./Scenario";
import Case1 from "./usePermission/Case1";
import Case1Source from "./usePermission/Case1.tsx?raw";
import Case2 from "./usePermission/Case2";
import Case2Source from "./usePermission/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="全部权限与任一权限"
        description="切换角色，分别观察需要全部权限和任一权限的功能。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="动态授权与撤销"
        description="替换权限集合后，按钮状态立即更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
