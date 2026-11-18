import { Scenario } from "./Scenario";
import Case1 from "./useVirtualList/Case1";
import Case1Source from "./useVirtualList/Case1.tsx?raw";
import Case2 from "./useVirtualList/Case2";
import Case2Source from "./useVirtualList/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="固定行高与定位方式"
        description="在两百条数据中跳转到指定索引，可选择居中或末尾对齐。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="空列表与追加数据"
        description="从空列表开始添加数据，清空后占位高度归零，避免保留旧滚动范围。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
