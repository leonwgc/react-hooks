import { Scenario } from "./Scenario";
import Case1 from "./useFullscreen/Case1";
import Case1Source from "./useFullscreen/Case1.tsx?raw";
import Case2 from "./useFullscreen/Case2";
import Case2Source from "./useFullscreen/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="显式进入与退出"
        description="把内容面板设为全屏目标，独立调用 enter 与 exit，并展示错误。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="阅读时切换字号"
        description="全屏状态控制内容字号，退出后恢复普通阅读样式。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
