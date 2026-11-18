import { Scenario } from "./Scenario";
import Case1 from "./usePageVisibility/Case1";
import Case1Source from "./usePageVisibility/Case1.tsx?raw";
import Case2 from "./usePageVisibility/Case2";
import Case2Source from "./usePageVisibility/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="仅在可见时轮询"
        description="手动启动后切换标签页，页面隐藏时传入 null 暂停定时任务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="记录页面返回次数"
        description="切换到其他标签页再返回，记录从 hidden 到 visible 的真实变化。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
