import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature1() {
  const [log, setLog] = React.useState<string[]>([]);
  const r = useRequest(
    async ({ signal }) => {
      await delay(signal, 1500);
      return "服务端：旧标题";
    },
    {
      initialData: "未加载",
      onSuccess: () => setLog((l) => [...l, "请求完成并写入"]),
    },
  );
  return (
    <>
      <button
        onClick={() => {
          setLog(["开始 1.5s 请求"]);
          r.run();
        }}
      >
        发起慢请求
      </button>
      <button
        onClick={() => {
          r.mutate("本地：已重命名");
          setLog((l) => [
            ...l,
            r.fetching ? "mutate 中止了进行中的请求" : "mutate 本地更新",
          ]);
        }}
      >
        立即本地修改
      </button>
      <output>
        data：{r.data} · fetching：{String(r.fetching)}
      </output>
      <p>{log.join(" → ")}</p>
    </>
  );
}

export default Feature1;
