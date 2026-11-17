import { useToggle } from "../../src";

export default function Demo() {
  const state = useToggle("网格", "列表");
  return (
    <div className="demo-row">
      <button onClick={state.toggle}>切换布局</button>
      <output>当前：{state.value}</output>
    </div>
  );
}
