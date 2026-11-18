import { useFormField, useForm } from "../../../src";

function Case1() {
  const f = useForm({
    initialValues: { quantity: 1 },
    mode: "onBlur",
    validators: {
      quantity: (value) => (value < 1 ? "数量至少为 1" : undefined),
    },
  });
  const field = useFormField(f.control, "quantity");
  return (
    <>
      <label>
        订阅数量
        <input
          type="number"
          value={field.value}
          onChange={(e) => field.setValue(Number(e.target.value))}
          onBlur={field.onBlur}
        />
      </label>
      <button onClick={() => field.setValue(0)}>设置无效数量</button>
      <button onClick={field.onBlur}>触碰并校验数量</button>
      <output>
        touched {String(field.touched)} · {field.error ?? "无错误"}
      </output>
    </>
  );
}

export default Case1;
