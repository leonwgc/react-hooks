import * as React from "react";

import { useBroadcastChannel } from "../../../src";

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

export default Case1;
