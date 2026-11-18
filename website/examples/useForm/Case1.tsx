import { useForm } from "../../../src";

function Case1() {
  const f = useForm<{ profile: { email: string } }>({
    initialValues: { profile: { email: "" } },
    mode: "onBlur",
    validators: {
      "profile.email": (value) =>
        value.includes("@") ? undefined : "请输入有效邮箱",
    },
  });
  return (
    <>
      <label>
        嵌套邮箱
        <input
          {...f.register("profile.email")}
          aria-invalid={!!f.errors["profile.email"]}
        />
      </label>
      <button onClick={() => void f.validate(["profile.email"])}>
        只校验邮箱
      </button>
      <button
        onClick={() => f.reset({ profile: { email: "demo@example.com" } })}
      >
        载入已有资料
      </button>
      <output>
        {f.errors["profile.email"] ?? "邮箱无错误"} · {JSON.stringify(f.values)}
      </output>
    </>
  );
}

export default Case1;
