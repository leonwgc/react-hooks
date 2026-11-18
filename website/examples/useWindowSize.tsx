import { Scenario } from "./Scenario";
import Case1 from "./useWindowSize/Case1";
import Case1Source from "./useWindowSize/Case1.tsx?raw";
import Case2 from "./useWindowSize/Case2";
import Case2Source from "./useWindowSize/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="按可用宽度计算列数"
        description="改变卡片最小宽度，结合真实窗口宽度计算建议列数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="视口比例与尺寸快照"
        description="记录当前视口后调整窗口，比较实时值与操作时的快照。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
