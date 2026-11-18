import { Scenario } from "./Scenario";
import Case1 from "./useIntersectionObserver/Case1";
import Case1Source from "./useIntersectionObserver/Case1.tsx?raw";
import Case2 from "./useIntersectionObserver/Case2";
import Case2Source from "./useIntersectionObserver/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="指定滚动根容器"
        description="目标只相对内部滚动容器计算可见比例，滚动或按钮定位均可触发。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="预加载边距"
        description="使用 100px rootMargin 提前感知目标，不代表目标已经实际进入可见区域。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
