import { useFieldArray, useForm } from "../../../src";

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

export default Enhanced2;
