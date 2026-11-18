import { useFormField, useForm } from "../../../src";

function Case2() {
  const f = useForm({ initialValues: { settings: { nickname: "访客" } } });
  const field = useFormField(f.control, "settings.nickname");
  return (
    <>
      <label>
        订阅昵称
        <input
          value={field.value}
          onChange={(e) => field.setValue(e.target.value)}
          onBlur={field.onBlur}
        />
      </label>
      <button onClick={() => f.setFieldValue("settings.nickname", "管理员")}>
        父表单写入昵称
      </button>
      <button onClick={() => f.reset()}>父表单重置</button>
      <output>
        订阅值 {field.value} · 已触碰 {String(field.touched)}
      </output>
    </>
  );
}

export default Case2;
