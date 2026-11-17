import { useLocalStorageState } from "../../src";

export default function Demo() {
  const state = useLocalStorageState("web-hooks:demo:theme", "浅色");
  return (
    <div className="demo-stack">
      <label>
        保存偏好
        <select
          value={state.value}
          onChange={(e) => state.setValue(e.target.value)}
        >
          <option>浅色</option>
          <option>深色</option>
          <option>跟随系统</option>
        </select>
      </label>
      <button className="secondary" onClick={state.remove}>
        清除保存
      </button>
      <output>{state.error ? "存储不可用" : "刷新后仍保留所选偏好"}</output>
    </div>
  );
}
