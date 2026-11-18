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

function Case1() {
  const source = React.useRef<LocalSource | null>(null);
  const events = useEventSource("/local-notice", {
    event: "notice",
    parse: (value) => {
      const data: unknown = JSON.parse(value);
      if (
        !data ||
        typeof data !== "object" ||
        !("title" in data) ||
        typeof data.title !== "string"
      )
        throw Error("缺少 title");
      return data.title;
    },
    factory: () => {
      const next = new LocalSource();
      source.current = next;
      return next;
    },
  });
  return (
    <>
      <button
        onClick={() => source.current?.send("notice", '{"title":"新通知"}')}
      >
        发送有效通知
      </button>
      <button onClick={() => source.current?.send("notice", "invalid")}>
        发送错误 JSON
      </button>
      <output>
        {events.status} · {events.data ?? "等待通知"}
      </output>
      {!!events.error && <p role="alert">{String(events.error)}</p>}
    </>
  );
}

export default Case1;
