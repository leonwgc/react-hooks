import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature1() {
  const [log, setLog] = React.useState<string[]>([]);
  const q = useAsyncQueue<string>({
    concurrency: 2,
    timeout: 300,
    retry: 1,
    retryOnTimeout: true,
  });
  const add = () => {
    let attempt = 0;
    const { promise } = q.add(async (signal) => {
      const current = ++attempt;
      // The first attempt is slow and times out; it still settles later with a stale value.
      await delay(new AbortController().signal, current === 1 ? 800 : 100);
      if (signal.aborted)
        setLog((l) => [...l, `第 ${current} 次尝试的迟到结果已忽略`]);
      return `第 ${current} 次尝试成功`;
    }, "首次超时的任务");
    promise.then(
      (value) => setLog((l) => [...l, value]),
      (error: Error) => setLog((l) => [...l, `失败：${error.name}`]),
    );
  };
  return (
    <>
      <button onClick={add}>添加首次会超时的任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status} · 已执行 {t.attempts} 次
            {t.status !== "queued" && t.status !== "running" && (
              <button className="secondary" onClick={() => q.remove(t.id)}>
                移除此记录
              </button>
            )}
          </li>
        ))}
      </ul>
      <output>{log.join(" → ") || "等待任务"}</output>
    </>
  );
}

export default Feature1;
