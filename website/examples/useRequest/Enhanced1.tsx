import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [ready, setReady] = React.useState(false),
    [page, setPage] = React.useState(1);
  const r = useRequest(
    async ({ signal }, page: number) => {
      await delay(signal, 400);
      return `第 ${page} 页`;
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

export default Enhanced1;
