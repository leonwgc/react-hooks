var e=`import * as React from "react";
import { useEventSource, type EventSourceConnection } from "../../src";
import { Scenario } from "./Scenario";
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自定义事件与 JSON 解析"
        description="本地事件源模拟命名事件，发送正确或错误 JSON，观察解析结果与错误恢复。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="按需连接与重新连接"
        description="url 为 null 时不连接，启用后可以主动关闭和重连；事件源仅在本地运行。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};