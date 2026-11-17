import { useBoolean } from "../../src";

export default function Demo() {
  const state = useBoolean(false);
  return (
    <div className="demo-row">
      <button onClick={state.toggle}>切换通知</button>
      <output>通知{state.value ? "已开启" : "已关闭"}</output>
      <button className="secondary" onClick={state.setFalse}>
        关闭
      </button>
    </div>
  );
}
