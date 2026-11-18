import * as React from "react";

import { useEventSource, type EventSourceConnection } from "../../../src";

class LocalSource extends EventTarget implements EventSourceConnection {
  readyState = 0;
  constructor() {
    super();
    queueMicrotask(() => {
      if (this.readyState === 2) return;
      this.readyState = 1;
      this.dispatchEvent(new Event("open"));
    });
  }
  close() {
    this.readyState = 2;
  }
  send(type: string, data: string) {
    if (this.readyState === 1)
      this.dispatchEvent(new MessageEvent(type, { data }));
  }
}

function Case2() {
  const [enabled, setEnabled] = React.useState(false);
  const source = React.useRef<LocalSource | null>(null);
  const events = useEventSource(enabled ? "/local-stream" : null, {
    parse: (value) => value,
    factory: () => {
      const next = new LocalSource();
      source.current = next;
      return next;
    },
  });
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用事件源" : "启用事件源"}
      </button>
      <button onClick={events.close}>关闭 SSE 连接</button>
      <button onClick={events.reconnect}>重连 SSE</button>
      <button onClick={() => source.current?.send("message", "本地推送")}>
        发送本地推送
      </button>
      <output>
        {events.status} · {events.data ?? "暂无消息"}
      </output>
    </>
  );
}

export default Case2;
