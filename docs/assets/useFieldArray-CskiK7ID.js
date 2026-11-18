var e=`import * as React from "react";
import { useFieldArray, useForm } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const f = useForm({ initialValues: { tags: ["React"] } });
  const a = useFieldArray(f, "tags");
  return (
    <>
      <div>
        {a.fields.map((field, i) => (
          <div className="demo-row" key={field.id}>
            <label>
              标签 {i + 1}
              <input {...f.register(\`tags.\${i}\`)} />
            </label>
            <button onClick={() => a.remove(i)}>删除标签 {i + 1}</button>
          </div>
        ))}
      </div>
      <button onClick={() => a.append("新标签")}>追加标签</button>
      <output>{JSON.stringify(f.values.tags)}</output>
    </>
  );
}
function Case2() {
  const f = useForm({
    initialValues: { rows: [{ title: "甲" }, { title: "乙" }] },
  });
  const a = useFieldArray(f, "rows");
  return (
    <>
      <button onClick={() => a.move(0, 1)}>交换两行位置</button>
      <button
        onClick={() => a.replace([{ title: "导入丙" }, { title: "导入丁" }])}
      >
        批量导入两行
      </button>
      <button onClick={() => f.reset()}>恢复初始数组</button>
      <ul>
        {a.fields.map((field) => (
          <li key={field.id}>
            {field.value.title} · ID {field.id}
          </li>
        ))}
      </ul>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="基本类型数组"
        description="数组项也可以是字符串，添加后通过字段路径编辑，删除后剩余项路径自动对应。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="批量替换与稳定标识"
        description="移动保留行 ID，replace 为新数据生成新 ID；表单 reset 恢复初始数组。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};