import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature1() {
  const [store] = React.useState(() => {
    const calls: Record<string, number> = {};
    return createQueryStore(
      async ({ signal }, key: string) => {
        await delay(signal, 100);
        calls[key] = (calls[key] ?? 0) + 1;
        return `第 ${calls[key]} 次请求`;
      },
      { staleTime: Infinity },
    );
  });
  const user = useQuery(store, "user");
  const detail = useQuery(store, "user:1");
  const users = useQuery(store, "users");
  return (
    <>
      <button onClick={() => store.invalidate("user", { exact: false })}>
        invalidate("user", {"{ exact: false }"})
      </button>
      <ul>
        <li>user：{user.data ?? user.status}</li>
        <li>user:1：{detail.data ?? detail.status}</li>
        <li>users：{users.data ?? users.status}（不受影响）</li>
      </ul>
    </>
  );
}

export default Feature1;
