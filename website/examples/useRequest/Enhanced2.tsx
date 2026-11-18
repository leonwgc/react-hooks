import * as React from "react";

import { useRequest } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const r = useRequest(
    async ({ signal }, ms: number) => {
      await delay(signal, ms);
      return `${ms}ms 请求完成`;
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

export default Enhanced2;
