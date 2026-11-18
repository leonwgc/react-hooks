import * as React from "react";
import { useBroadcastChannel } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const parse = (v: unknown) => {
    if (
      !v ||
      typeof v !== "object" ||
      !("count" in v) ||
      typeof v.count !== "number"
    )
      throw Error("消息格式错误");
    return { count: v.count };
  };
  const a = useBroadcastChannel("hooks-examples-object", parse);
  const b = useBroadcastChannel("hooks-examples-object", parse);
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button
        disabled={!a.supported}
        onClick={() => {
          setCount((n) => n + 1);
          a.postMessage({ count: count + 1 });
        }}
      >
        发送对象计数
      </button>
      <output>
        接收计数 {b.message?.count ?? "暂无"}
        {!a.supported ? " · 浏览器不支持" : ""}
      </output>
      {!!b.error && <p role="alert">{String(b.error)}</p>}
    </>
  );
}
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="结构化消息与解析"
        description="双连接演示对象消息，接收时验证字段后显示业务内容。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="不同频道互相隔离"
        description="发送方和接收方可使用不同频道，切换到同频道后再次发送才会收到。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
