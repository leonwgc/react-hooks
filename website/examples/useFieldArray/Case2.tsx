import { useFieldArray, useForm } from "../../../src";

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

export default Case2;
