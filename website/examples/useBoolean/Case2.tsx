import { useBoolean } from "../../../src";

function Case2() {
  const state = useBoolean(true);
  return (
    <>
      <div className="demo-row">
        <button onClick={state.setTrue}>启用功能</button>
        <button onClick={state.setFalse}>停用功能</button>
        <button onClick={() => state.setValue((v) => !v)}>函数式反转</button>
      </div>
      <output>{state.value ? "功能已启用" : "功能已停用"}</output>
    </>
  );
}

export default Case2;
