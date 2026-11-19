import { Scenario } from "./Scenario";
import Case1 from "./useSearch/Case1";
import Case1Source from "./useSearch/Case1.tsx?raw";
import Case2 from "./useSearch/Case2";
import Case2Source from "./useSearch/Case2.tsx?raw";
import Feature1 from "./useSearch/Feature1";
import Feature1Source from "./useSearch/Feature1.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="组合筛选与提交快照"
        description="编辑分类不会立即改变已提交条件，点击提交后一起生效。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="同条件刷新与恢复默认"
        description="重复提交增加 revision；reset 恢复初始条件并产生一次新的查询版本。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Feature1Source}
        title="合并与整体替换草稿"
        description="setDraft 浅合并会保留旧条件，replaceDraft 会用预设整体替换草稿。"
      >
        <Feature1 />
      </Scenario>
    </div>
  );
}
