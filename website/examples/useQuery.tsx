import * as React from "react";
import { createQueryStore, useQuery } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
function Case1() {
  const [store] = React.useState(() => {
    let calls = 0;
    return createQueryStore(
      async ({ signal }, key: string) => {
        await delay(signal, 100);
        return `${key} / 请求 ${++calls}`;
      },
      { staleTime: Infinity },
    );
  });
  const [key, setKey] = React.useState<string | null>("A");
  const q = useQuery(store, key);
  return (
    <>
      <button onClick={() => setKey("A")}>查看缓存 A</button>
      <button onClick={() => setKey("B")}>查看缓存 B</button>
      <button onClick={() => setKey(null)}>停止查询订阅</button>
      <output>{q.data ?? q.status}</output>
    </>
  );
}
function Case2() {
  const fail = React.useRef(true);
  const [store] = React.useState(() =>
    createQueryStore(async ({ signal }) => {
      await delay(signal, 300);
      if (fail.current) throw Error("模拟缓存请求失败");
      return "查询已恢复";
    }),
  );
  const q = useQuery(store, "manual", { enabled: false });
  return (
    <>
      <button onClick={() => void q.refetch().catch(() => {})}>
        手动获取缓存数据
      </button>
      <button
        onClick={() => {
          fail.current = false;
          void q.refetch().catch(() => {});
        }}
      >
        关闭失败并重试
      </button>
      <button onClick={q.cancel}>取消共享请求</button>
      <output>{q.data ?? q.status}</output>
      {!!q.error && <p role="alert">{String(q.error)}</p>}
    </>
  );
}

function Enhanced1() {
  const [page, setPage] = React.useState(1);
  const [store] = React.useState(() =>
    createQueryStore<string, readonly ["articles", { page: number }]>(
      async ({ signal }, [, params]) => {
        await delay(signal, 600);
        return `第 ${params.page} 页数据`;
      },
      { staleTime: Infinity },
    ),
  );
  const q = useQuery(store, ["articles", { page }], { keepPreviousData: true });
  return (
    <>
      <button disabled={q.isFetching} onClick={() => setPage((p) => p + 1)}>
        查询下一页
      </button>
      <button onClick={() => store.invalidate(["articles"], { exact: false })}>
        刷新文章前缀
      </button>
      <output>
        {q.data ?? "首次加载"} ·{" "}
        {q.isPreviousData ? "保留前页" : q.isFetching ? "刷新中" : "当前页"}
      </output>
    </>
  );
}

const countSelector = (value: { count: number; note: string }) => value.count;
const SelectedCount = React.memo(function SelectedCount({
  store,
}: {
  store: ReturnType<typeof createQueryStore<{ count: number; note: string }>>;
}) {
  const renders = React.useRef(0);
  renders.current++;
  const q = useQuery(store, "stats", {
    enabled: false,
    select: countSelector,
    notifyOnChangeProps: ["data"],
  });
  return (
    <output>
      计数 {q.data ?? 0} · 渲染 {renders.current}
    </output>
  );
});
function Enhanced2() {
  const [store] = React.useState(() => {
    const s = createQueryStore(async () => ({ count: 0, note: "初始" }));
    s.setData("stats", { count: 0, note: "初始" });
    return s;
  });
  const q = useQuery(store, "stats", { enabled: false });
  return (
    <>
      <button
        onClick={() =>
          q.setData((p) => ({
            count: p?.count ?? 0,
            note: `备注 ${Date.now()}`,
          }))
        }
      >
        仅修改备注
      </button>
      <button
        onClick={() =>
          q.setData((p) => ({
            count: (p?.count ?? 0) + 1,
            note: p?.note ?? "",
          }))
        }
      >
        增加订阅计数
      </button>
      <SelectedCount store={store} />
      <p>{q.data?.note}</p>
    </>
  );
}

export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="缓存键切换与复用"
        description="A、B 使用不同缓存项，再次切回 A 会复用新鲜数据；null 暂停订阅。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="手动查询与错误恢复"
        description="enabled 为 false 时不自动请求；失败后显式重试，并可取消正在进行的请求。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        title="结构键与分页保留"
        description="用数组和对象描述缓存键，切页时保留前页数据，并可按 articles 前缀刷新全部已有页。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        title="选择数据与隔离订阅"
        description="两个订阅者共用缓存，计数组件只订阅 count；修改备注不会重绘该组件。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
