import { useFieldArray, useForm } from "../../../src";

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

export default Enhanced1;
