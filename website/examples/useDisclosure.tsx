import { Scenario } from "./Scenario";
import Case1 from "./useDisclosure/Case1";
import Case1Source from "./useDisclosure/Case1.tsx?raw";
import Case2 from "./useDisclosure/Case2";
import Case2Source from "./useDisclosure/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="默认展开的帮助面板"
        description="通过初始状态控制首次展示，重复打开保持展开。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="互斥的详情面板"
        description="组合两个独立实例，在打开一个时关闭另一个。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
