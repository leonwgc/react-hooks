import { useState } from "react";
import { useLeaveConfirm } from "../../src";
export default function Demo() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState("");
  const [left, setLeft] = useState(false);
  const leave = useLeaveConfirm(text !== saved);
  return (
    <div className="demo-stack">
      <label>
        草稿
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setLeft(false);
          }}
        />
      </label>
      <div className="demo-row">
        <button onClick={() => setSaved(text)}>保存草稿</button>
        <button onClick={() => void leave.guard(() => setLeft(true))}>
          模拟离开编辑页
        </button>
      </div>
      <output>
        {left
          ? "已确认离开"
          : text === saved
            ? "没有未保存修改"
            : "有未保存修改"}
      </output>
      <small>示例导航通过 guard 显式接入；关闭标签页提示由浏览器决定。</small>
    </div>
  );
}
