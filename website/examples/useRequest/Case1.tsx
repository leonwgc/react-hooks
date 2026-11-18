import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [polling, setPolling] = React.useState(false);
  const count = React.useRef(0);
  const r = useRequest(
    async ({ signal }, name: string) => {
      await delay(signal, 150);
      return `${name}：第 ${++count.current} 次更新`;
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

export default Case1;
