import * as React from "react";

import { useBroadcastChannel } from "../../../src";

function Case2() {
  const [channel, setChannel] = React.useState("B");
  const parse = (v: unknown) => String(v);
  const sender = useBroadcastChannel("hooks-channel-A", parse);
  const receiver = useBroadcastChannel("hooks-channel-" + channel, parse);
  return (
    <>
      <button onClick={() => setChannel((v) => (v === "A" ? "B" : "A"))}>
        切换接收频道
      </button>
      <button
        disabled={!sender.supported}
        onClick={() => sender.postMessage("来自 A 的消息")}
      >
        向 A 发送消息
      </button>
      <output>
        当前频道 {channel} · {receiver.message ?? "未收到消息"}
        {!sender.supported ? " · 浏览器不支持" : ""}
      </output>
    </>
  );
}

export default Case2;
