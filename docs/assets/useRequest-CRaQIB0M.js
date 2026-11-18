var e=`import * as React from "react";
import { useRequest } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
function Case1() {
  const [polling, setPolling] = React.useState(false);
  const count = React.useRef(0);
  const r = useRequest(
    async ({ signal }, name: string) => {
      await delay(signal, 150);
      return \`\${name}：第 \${++count.current} 次更新\`;
    },
    {
      manual: false,
      defaultParams: ["通知"],
      pollingInterval: polling ? 1000 : undefined,
    },
  );
  return (
    <>
      <button onClick={() => setPolling(true)}>启动通知轮询</button>
      <button
        onClick={() => {
          setPolling(false);
          r.cancel();
        }}
      >
        停止通知轮询
      </button>
      <button onClick={r.refresh}>手动刷新通知</button>
      <output>{r.loading ? "更新中" : (r.data ?? "等待自动请求")}</output>
      {!!r.error && <p role="alert">{String(r.error)}</p>}
    </>
  );
}
function Case2() {
  const r = useRequest(async ({ signal }, name: string, ms: number) => {
    await delay(signal, ms);
    return name;
  });
  return (
    <>
      <button onClick={() => r.run("较慢旧结果", 900)}>发送慢请求</button>
      <button onClick={() => r.run("较快新结果", 100)}>发送快请求</button>
      <button onClick={() => r.mutate("本地修订结果")}>本地更新结果</button>
      <button onClick={r.cancel}>取消竞争请求</button>
      <output>{r.loading ? "请求中" : (r.data ?? "暂无数据")}</output>
    </>
  );
}

function Enhanced1() {
  const [ready, setReady] = React.useState(false),
    [page, setPage] = React.useState(1);
  const r = useRequest(
    async ({ signal }, page: number) => {
      await delay(signal, 400);
      return \`第 \${page} 页\`;
    },
    { manual: false, defaultParams: [page], ready, refreshDeps: [page] },
  );
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={ready}
          onChange={(e) => setReady(e.target.checked)}
        />
        允许请求
      </label>
      <button onClick={() => setPage((p) => p + 1)}>下一页条件</button>
      <output>
        页码 {page} · {r.fetching ? "请求中" : (r.data ?? "等待就绪")}
      </output>
    </>
  );
}

function Enhanced2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const r = useRequest(
    async ({ signal }, ms: number) => {
      await delay(signal, ms);
      return \`\${ms}ms 请求完成\`;
    },
    {
      loadingDelay: 300,
      onBefore: () => setEvents((x) => [...x, "开始"]),
      onFinally: () => setEvents((x) => [...x, "完成"]),
    },
  );
  return (
    <>
      <button onClick={() => r.run(50)}>快速请求 50ms</button>
      <button onClick={() => r.run(900)}>慢速请求 900ms</button>
      <button onClick={r.cancel}>取消延迟请求</button>
      <output>
        fetching: {String(r.fetching)} · loading: {String(r.loading)} · {r.data}
      </output>
      <p>{events.join(" → ")}</p>
    </>
  );
}

export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自动请求与轮询控制"
        description="展开时按默认参数请求，启动轮询后定期刷新，停止会取消本轮并暂停后续轮询。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="竞争请求与本地修改"
        description="慢请求和快请求连续发出时只保留最新结果，mutate 可直接更新当前展示数据。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        title="就绪条件与依赖刷新"
        description="启用查询后自动加载；切换页码通过 refreshDeps 请求，关闭就绪条件会取消当前请求。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="延迟加载与生命周期"
        description="快请求不闪烁 loading；慢请求延迟显示加载，取消不触发 onFinally。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};