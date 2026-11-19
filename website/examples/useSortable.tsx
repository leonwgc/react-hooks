import { Scenario } from "./Scenario";
import Case1 from "./useSortable/Case1";
import Case1Source from "./useSortable/Case1.tsx?raw";
import Case2 from "./useSortable/Case2";
import Case2Source from "./useSortable/Case2.tsx?raw";
import Feature1 from "./useSortable/Feature1";
import Feature1Source from "./useSortable/Feature1.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="禁用排序与受控数据"
        description="锁定后拖放、键盘和 move 都不会改动列表；解锁后再尝试移动。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="键盘取消与边界移动"
        description="聚焦项目后按空格拾取、方向键移动、Esc 恢复原顺序；越界 move 返回 false。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Feature1Source}
        title="自定义播报文案与失焦取消"
        description="通过 messages 提供英文读屏文案；键盘排序过程中焦点离开列表会取消并恢复原顺序。"
      >
        <Feature1 />
      </Scenario>
    </div>
  );
}
