import { Scenario } from "./Scenario";
import Case1 from "./useMemoizedFn/Case1";
import Case1Source from "./useMemoizedFn/Case1.tsx?raw";
import Case2 from "./useMemoizedFn/Case2";
import Case2Source from "./useMemoizedFn/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="参数与返回值透传"
        description="改变倍率后，稳定函数会使用最新倍率计算并返回结果。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="订阅无需重新绑定"
        description="局部事件源只绑定一次，改变前缀后事件处理函数仍使用最新文案。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
