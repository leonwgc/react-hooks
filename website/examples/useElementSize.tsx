import { Scenario } from "./Scenario";
import Case1 from "./useElementSize/Case1";
import Case1Source from "./useElementSize/Case1.tsx?raw";
import Case2 from "./useElementSize/Case2";
import Case2Source from "./useElementSize/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="通过控件改变容器宽度"
        description="滑块修改容器 CSS 宽度，观察 ResizeObserver 发布的实际尺寸。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="内容驱动高度变化"
        description="添加和移除段落，观察同一元素高度变化，无需监听窗口 resize。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
