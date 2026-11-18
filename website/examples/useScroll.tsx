import { Scenario } from "./Scenario";
import Case1 from "./useScroll/Case1";
import Case1Source from "./useScroll/Case1.tsx?raw";
import Case2 from "./useScroll/Case2";
import Case2Source from "./useScroll/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="横向滚动位置"
        description="横向容器使用 x 值；按钮和手动滚动共用同一真实滚动状态。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="阅读进度与回到顶部"
        description="依据容器 scrollHeight 计算阅读进度，滚动一段后显示返回按钮。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
