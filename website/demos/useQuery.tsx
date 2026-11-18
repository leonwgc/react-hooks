import { useState } from "react";
import { createQueryStore, useQuery } from "../../src";
import { delay } from "./webHelpers";
export default function Demo() {
  const [store] = useState(() => {
    let calls = 0;
    return createQueryStore(async ({ signal }) => {
      await delay(signal, 250);
      return ++calls;
    });
  });
  const a = useQuery(store, "shared"),
    b = useQuery(store, "shared");
  return (
    <div className="demo-stack">
      <p>两个订阅者共用一个键，只发起一次本地模拟请求。</p>
      <output>
        A：{a.data ?? "等待"} / B：{b.data ?? "等待"}
      </output>
      <button onClick={() => void a.refetch().catch(() => {})}>
        从 A 刷新共享查询
      </button>
      <button onClick={() => b.setData(99)}>从 B 更新共享缓存</button>
      <button onClick={a.invalidate}>失效并重新查询</button>
      {!!a.error && <p role="alert">{String(a.error)}</p>}
    </div>
  );
}
