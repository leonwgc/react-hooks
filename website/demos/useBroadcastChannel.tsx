import { useState } from "react";
import { useBroadcastChannel } from "../../src";
function parse(value: unknown) {
  if (typeof value !== "string") throw new Error("消息必须是文本");
  return value;
}
export default function Demo() {
  const [text, setText] = useState("你好，另一个标签页！");
  const sender = useBroadcastChannel("web-hooks-demo", parse);
  const receiver = useBroadcastChannel("web-hooks-demo", parse);
  return (
    <div className="demo-stack">
      <label>
        消息
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button
        disabled={!sender.supported}
        onClick={() => sender.postMessage(text)}
      >
        广播消息
      </button>
      <output>另一个连接收到：{receiver.message ?? "暂无消息"}</output>
      {!!sender.error && <p role="alert">{String(sender.error)}</p>}
      <small>同页双连接演示；再打开一个同源标签页也可接收。</small>
    </div>
  );
}
