import { useEventSource, type EventSourceConnection } from "../../src";
function simulatedSource(): EventSourceConnection {
  const source = new EventTarget();
  let readyState = 0;
  let count = 0;
  const open = setTimeout(() => {
    readyState = 1;
    source.dispatchEvent(new Event("open"));
  }, 50);
  const timer = setInterval(
    () =>
      source.dispatchEvent(
        new MessageEvent("message", { data: `通知 ${++count}` }),
      ),
    1500,
  );
  return Object.defineProperty(
    Object.assign(source, {
      readyState: 0,
      close() {
        readyState = 2;
        clearTimeout(open);
        clearInterval(timer);
      },
    }),
    "readyState",
    { get: () => readyState },
  );
}
export default function Demo() {
  const events = useEventSource("/simulated-events", {
    parse: (value) => value,
    factory: simulatedSource,
  });
  return (
    <div className="demo-stack">
      <p>本地模拟 SSE 事件源；生产环境不传 factory 时使用原生 EventSource。</p>
      <output>
        连接：{events.status} · {events.data ?? "等待通知"}
      </output>
      <div className="demo-row">
        <button onClick={events.close}>断开连接</button>
        <button onClick={events.reconnect}>重新连接</button>
      </div>
    </div>
  );
}
