import { Scenario } from "./Scenario";
import Case1 from "./useSelection/Case1";
import Case1Source from "./useSelection/Case1.tsx?raw";
import Case2 from "./useSelection/Case2";
import Case2Source from "./useSelection/Case2.tsx?raw";
import Enhanced1 from "./useSelection/Enhanced1";
import Enhanced1Source from "./useSelection/Enhanced1.tsx?raw";
import Enhanced2 from "./useSelection/Enhanced2";
import Enhanced2Source from "./useSelection/Enhanced2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="半选与全选状态"
        description="选择一项进入半选，全选和清空使用不同操作，空列表不会被视为全选。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="切换查询时重置"
        description="preserve 保留跨页选择，但 resetKey 变化会清空旧查询的选择。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="Shift 范围与禁用项"
        description="先点 A，再按住 Shift 点 E，范围选中跳过禁用的 C；也可用按钮执行相同范围选择。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="选择上限与动态裁剪"
        description="设置最多可选数量，批量选择遵守上限；缩小上限或禁用已选项会自动裁剪。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
