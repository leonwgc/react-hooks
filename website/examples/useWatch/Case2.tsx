import * as React from "react";

import {
  useFormField,
  useForm,
  useWatch,
  type FormControl,
} from "../../../src";

type Order = { name: string; size: "S" | "M" | "L"; gift: boolean };

const NameField = React.memo(function NameField({
  control,
}: {
  control: FormControl<Order>;
}) {
  const field = useFormField(control, "name");
  return (
    <label>
      收件人
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const Preview = React.memo(function Preview({
  control,
}: {
  control: FormControl<Order>;
}) {
  const order = useWatch(control);
  return (
    <pre>
      {`收件人：${order.name || "（未填写）"}\n尺码：${order.size}\n礼品包装：${order.gift ? "是" : "否"}`}
    </pre>
  );
});

function Case2() {
  const form = useForm<Order>({
    initialValues: { name: "", size: "M", gift: false },
  });
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <button onClick={() => form.setFieldValue("gift", true)}>
        添加礼品包装
      </button>
      <NameField control={form.control} />
      <Preview control={form.control} />
      <output>表单根组件渲染 {renders.current} 次</output>
    </>
  );
}

export default Case2;
