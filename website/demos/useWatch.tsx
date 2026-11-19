import { memo, useRef } from "react";
import { useForm, useFormField, useWatch, type FormControl } from "../../src";
type Order = { product: string; quantity: number };
const Quantity = memo(function Quantity({
  control,
}: {
  control: FormControl<Order>;
}) {
  const field = useFormField(control, "quantity");
  return (
    <label>
      数量
      <input
        type="number"
        min={1}
        value={field.value}
        onChange={(e) => field.setValue(Number(e.target.value))}
      />
    </label>
  );
});
const Total = memo(function Total({
  control,
}: {
  control: FormControl<Order>;
}) {
  const quantity = useWatch(control, "quantity");
  const renders = useRef(0);
  renders.current++;
  return (
    <output>
      合计 {quantity * 25} 元 · 合计区域渲染 {renders.current} 次
    </output>
  );
});
export default function Demo() {
  const form = useForm<Order>({
    initialValues: { product: "笔记本", quantity: 1 },
  });
  const renders = useRef(0);
  renders.current++;
  return (
    <div className="demo-stack">
      <Quantity control={form.control} />
      <Total control={form.control} />
      <small>
        表单根组件渲染 {renders.current}{" "}
        次：数量只由子组件订阅，修改数量时根组件不会重渲染。开发模式可能重复渲染用于检查。
      </small>
      <button onClick={() => form.reset()}>重置数量</button>
    </div>
  );
}
