import * as React from "react";

import { createQueryStore, useQuery } from "../../../src";

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

export default Enhanced2;
