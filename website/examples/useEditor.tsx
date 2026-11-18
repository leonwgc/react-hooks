import { Scenario } from "./Scenario";
import Case1 from "./useEditor/Case1";
import Case1Source from "./useEditor/Case1.tsx?raw";
import Case2 from "./useEditor/Case2";
import Case2Source from "./useEditor/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="从列表切换编辑对象"
        description="连续选择不同记录，面板显示最新记录；关闭不会删除原始数据。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="新建清空旧记录"
        description="先编辑，再进入新建模式，观察 record 变为 null。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
