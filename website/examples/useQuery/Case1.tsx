import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

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

export default Case1;
