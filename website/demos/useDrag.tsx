import { useState } from "react";
import { useDrag, useDrop } from "../../src";
export default function Demo() {
  const [text, setText] = useState("尚未接收");
  const drag = useDrag("来自卡片的数据");
  const drop = useDrop(({ text }) => setText(text));
  return (
    <div className="demo-stack">
      <div {...drag.bind} className="notice">
        {drag.dragging ? "正在拖动…" : "拖动这张卡片"}
      </div>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开放置" : text}
      </div>
      <small>使用浏览器原生拖放；键盘用户可通过按钮执行等价操作。</small>
      <button onClick={() => setText("来自卡片的数据")}>发送卡片数据</button>
    </div>
  );
}
