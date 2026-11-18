import { useForm } from "../../../src";

function Enhanced1() {
  const f = useForm({
    initialValues: { name: "", email: "" },
    shouldFocusError: true,
    validators: {
      name: (v) => (v ? undefined : "请输入姓名"),
      email: (v) => (v.includes("@") ? undefined : "请输入邮箱"),
    },
  });
  return (
    <form className="demo-stack" onSubmit={f.handleSubmit(() => {})}>
      <label>
        聚焦姓名
        <input {...f.register("name")} />
      </label>
      <label>
        聚焦邮箱
        <input {...f.register("email")} />
      </label>
      <button type="submit">校验并定位错误</button>
      <button type="button" onClick={() => f.resetField("name")}>
        只重置姓名
      </button>
      <output>{JSON.stringify(f.errors)}</output>
    </form>
  );
}

export default Enhanced1;
