import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced2() {
  const q = useAsyncQueue<string>({
    concurrency: 1,
    retry: 2,
    retryDelay: 300,
  });
  return (
    <>
      <button
        onClick={() => {
          let attempt = 0;
          q.add(async (signal) => {
            await delay(signal, 100);
            if (++attempt < 3) throw Error("模拟暂时失败");
            return "第三次成功";
          }, "重试任务");
        }}
      >
        加入可恢复任务
      </button>
      <button
        onClick={() =>
          q.add(
            async (signal) => {
              await delay(signal, 1500);
              return "完成";
            },
            "超时任务",
            { timeout: 200 },
          )
        }
      >
        加入超时任务
      </button>
      <button onClick={q.cancelAll}>取消所有增强任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label} · {t.status} · 尝试 {t.attempts} ·{" "}
            {t.result ?? String(t.error ?? "")}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced2;
