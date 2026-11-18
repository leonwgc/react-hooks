import { Scenario } from "./Scenario";
import Case1 from "./useUndoRedo/Case1";
import Case1Source from "./useUndoRedo/Case1.tsx?raw";
import Case2 from "./useUndoRedo/Case2";
import Case2Source from "./useUndoRedo/Case2.tsx?raw";
import Enhanced1 from "./useUndoRedo/Enhanced1";
import Enhanced1Source from "./useUndoRedo/Enhanced1.tsx?raw";
import Enhanced2 from "./useUndoRedo/Enhanced2";
import Enhanced2Source from "./useUndoRedo/Enhanced2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="有限历史与分支丢弃"
        description="最多保留两步；撤销后写入新值会清除重做分支。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="替换快照与清除历史"
        description="replace 不新增撤销步骤；clear 保留当前值并清空历史。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="连续输入合并与标签"
        description="800ms 内的连续输入归为一次撤销，停顿或撤销会打断合并；显示下一次操作标签。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="事务提交与回滚"
        description="事务中修改多个属性，提交只生成一个撤销步骤；回滚恢复事务前的值和历史。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
