import { useSessionStorageState } from "../../src";

export default function Demo() {
  const state = useSessionStorageState("web-hooks:demo:draft", "");
  return (
    <div className="demo-stack">
      <label>
        会话草稿
        <textarea
          value={state.value}
          onChange={(e) => state.setValue(e.target.value)}
          placeholder="刷新页面后草稿仍在"
        />
      </label>
      <button className="secondary" onClick={state.remove}>
        清除草稿
      </button>
      <output>
        {state.error ? "当前浏览器不允许存储" : "在当前标签页会话中保存"}
      </output>
    </div>
  );
}
