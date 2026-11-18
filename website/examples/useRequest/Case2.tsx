import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

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

export default Case2;
