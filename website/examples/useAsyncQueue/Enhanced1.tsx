import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [log, setLog] = React.useState<string[]>([]),
    [error, setError] = React.useState("");
  const q = useAsyncQueue<string>({ concurrency: 1, capacity: 2 });
  const add = (label: string, priority: number) => {
    const h = q.add(
      async (signal) => {
        await delay(signal, 250);
        setLog((x) => [...x, label]);
        return label;
      },
      label,
      { priority },
    );
    void h.promise.catch((e) => setError(String(e)));
  };
  return (
    <>
      <button
        onClick={() => {
          q.pause();
          setLog([]);
          setError("");
          add("普通任务", 0);
          add("高优先级", 10);
          add("超额任务", 20);
        }}
      >
        准备优先级队列
      </button>
      <button onClick={q.resume}>恢复优先级调度</button>
      <output>{log.join(" → ") || "等待运行"}</output>
      {error && <p role="alert">{error}</p>}
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label} · {t.status}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced1;
