import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

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

export default Case2;
