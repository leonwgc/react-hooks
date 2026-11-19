import * as React from "react";

import {
  useForm,
  useFormField,
  useWatch,
  type FormControl,
} from "../../../src";

type Shipping = { method: "pickup" | "express"; address: string; note: string };

const AddressInput = React.memo(function AddressInput({
  control,
}: {
  control: FormControl<Shipping>;
}) {
  const field = useFormField(control, "address");
  return (
    <label>
      收货地址
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const AddressSection = React.memo(function AddressSection({
  control,
}: {
  control: FormControl<Shipping>;
}) {
  const method = useWatch(control, "method");
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <output>条件区域渲染 {renders.current} 次</output>
      {method === "express" && <AddressInput control={control} />}
    </>
  );
});

function Case1() {
  const form = useForm<Shipping>({
    initialValues: { method: "pickup", address: "", note: "" },
  });
  return (
    <>
      <button onClick={() => form.setFieldValue("method", "express")}>
        切换为快递配送
      </button>
      <label className="check">
        <input type="radio" {...form.register("method", { value: "pickup" })} />
        到店自取
      </label>
      <label className="check">
        <input
          type="radio"
          {...form.register("method", { value: "express" })}
        />
        快递配送
      </label>
      <label>
        备注（不会触发条件区域渲染）
        <input {...form.register("note")} />
      </label>
      <AddressSection control={form.control} />
    </>
  );
}

export default Case1;
