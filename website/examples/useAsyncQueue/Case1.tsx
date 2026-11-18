import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [limit, setLimit] = React.useState(1);
  const q = useAsyncQueue<number>({ concurrency: limit });
  return (
    <>
      <label>
        并发上限
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option>1</option>
          <option>3</option>
        </select>
      </label>
      <button
        onClick={() => {
          for (let i = 0; i < 4; i++)
            q.add(
              async (signal) => {
                await delay(signal, 1200);
                return i;
              },
              `批量任务 ${i + 1}`,
            );
        }}
      >
        新增四个任务
      </button>
      <button onClick={q.cancelAll}>取消这批任务</button>
      <output>
        运行 {q.running} · 等待 {q.pending}
      </output>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case1;
