import { Scenario } from "./Scenario";
import Case1 from "./useFieldArray/Case1";
import Case1Source from "./useFieldArray/Case1.tsx?raw";
import Case2 from "./useFieldArray/Case2";
import Case2Source from "./useFieldArray/Case2.tsx?raw";
import Enhanced1 from "./useFieldArray/Enhanced1";
import Enhanced1Source from "./useFieldArray/Enhanced1.tsx?raw";
import Enhanced2 from "./useFieldArray/Enhanced2";
import Enhanced2Source from "./useFieldArray/Enhanced2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="基本类型数组"
        description="数组项也可以是字符串，添加后通过字段路径编辑，删除后剩余项路径自动对应。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="批量替换与稳定标识"
        description="移动保留行 ID，replace 为新数据生成新 ID；表单 reset 恢复初始数组。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="插入交换与元数据跟随"
        description="给第一行标记错误后交换行，错误与 touched 随原记录移动；插入的新行有独立 ID。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="更新保留身份与数组重置"
        description="更新一行保留 ID，头部插入不改变旧行身份；重置数组则为全部行重新生成 ID。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
