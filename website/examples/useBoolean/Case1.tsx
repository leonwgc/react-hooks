import { useBoolean } from "../../../src";

function Case1() {
  const visible = useBoolean();
  return (
    <>
      <label>
        演示密码
        <input
          type={visible.value ? "text" : "password"}
          defaultValue="demo-password"
        />
      </label>
      <button onClick={visible.toggle}>
        {visible.value ? "隐藏密码" : "显示密码"}
      </button>
    </>
  );
}

export default Case1;
