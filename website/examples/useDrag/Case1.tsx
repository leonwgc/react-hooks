import * as React from "react";

import { useDrag, useDrop } from "../../../src";

function Case1() {
  const [result, setResult] = React.useState("等待卡片");
  const payload = JSON.stringify({ id: 7, title: "任务卡片" });
  const drag = useDrag(payload, {
    type: "application/x-hook-card",
    effectAllowed: "copy",
  });
  const accept = (text: string) => {
    try {
      const value: unknown = JSON.parse(text);
      setResult(JSON.stringify(value));
    } catch {
      setResult("数据格式错误");
    }
  };
  const drop = useDrop(({ text }) => accept(text), {
    type: "application/x-hook-card",
    dropEffect: "copy",
  });
  return (
    <>
      <div {...drag.bind} className="notice">
        拖动 JSON 卡片
      </div>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开以接收" : result}
      </div>
      <button onClick={() => accept(payload)}>键盘发送 JSON 卡片</button>
    </>
  );
}

export default Case1;
