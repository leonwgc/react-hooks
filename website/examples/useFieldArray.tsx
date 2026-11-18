import * as React from "react";
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
              <input {...f.register(`tags.${i}`)} />
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

function Enhanced1() {
  const f = useForm({
      initialValues: { rows: [{ name: "甲" }, { name: "乙" }] },
    }),
    a = useFieldArray(f, "rows");
  return (
    <>
      <button
        onClick={() => {
          f.setFieldError("rows.0.name", "需要修订");
          f.setFieldTouched("rows.0.name");
        }}
      >
        标记第一行错误
      </button>
      <button onClick={() => a.swap(0, 1)}>交换前两行</button>
      <button onClick={() => a.insert(1, { name: "新行" })}>
        中间插入一行
      </button>
      <ul>
        {a.fields.map((row, index) => (
          <li key={row.id}>
            {row.value.name} · {row.id} ·{" "}
            {f.errors[`rows.${index}.name`] ?? "无错误"} · touched{" "}
            {String(!!f.touched[`rows.${index}.name`])}
          </li>
        ))}
      </ul>
    </>
  );
}

function Enhanced2() {
  const f = useForm({ initialValues: { rows: [{ name: "原始行" }] } }),
    a = useFieldArray(f, "rows");
  return (
    <>
      <button onClick={() => a.update(0, { name: "已更新" })}>
        更新首行内容
      </button>
      <button onClick={() => a.prepend({ name: "头部新增" })}>
        头部新增一行
      </button>
      <button onClick={() => f.resetField("rows")}>重置数组字段</button>
      <ul>
        {a.fields.map((row) => (
          <li key={row.id}>
            {row.value.name} · {row.id}
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
      <Scenario
        title="插入交换与元数据跟随"
        description="给第一行标记错误后交换行，错误与 touched 随原记录移动；插入的新行有独立 ID。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="更新保留身份与数组重置"
        description="更新一行保留 ID，头部插入不改变旧行身份；重置数组则为全部行重新生成 ID。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
