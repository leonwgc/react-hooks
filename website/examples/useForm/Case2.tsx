import { useForm } from "../../../src";

function Case2() {
  const f = useForm({ initialValues: { name: "演示用户" } });
  return (
    <form
      className="demo-stack"
      onSubmit={f.handleSubmit(async () => {
        throw Error("模拟服务暂时不可用");
      })}
    >
      <label>
        提交姓名
        <input {...f.register("name")} />
      </label>
      <button type="submit">提交并模拟失败</button>
      <button
        type="button"
        onClick={() => f.setFieldError("name", "服务端提示：名称已存在")}
      >
        设置字段业务错误
      </button>
      <button type="button" onClick={() => f.reset()}>
        重置提交状态
      </button>
      {f.errors.name && <p role="alert">{f.errors.name}</p>}
      {!!f.submitError && <p role="alert">{String(f.submitError)}</p>}
      <output>{f.isSubmitting ? "正在提交" : "等待操作"}</output>
    </form>
  );
}

export default Case2;
