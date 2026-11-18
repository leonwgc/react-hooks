import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const q = useAsyncQueue<string>({ concurrency: 1 });
  return (
    <>
      <button
        onClick={() => {
          q.add(async (signal) => {
            await delay(signal, 100);
            throw Error("演示任务失败");
          }, "失败任务");
          q.add(async (signal) => {
            await delay(signal, 100);
            return "成功结果";
          }, "后续任务");
        }}
      >
        加入失败和成功任务
      </button>
      <button onClick={q.clear}>清理结束任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status} {t.result} {t.error ? String(t.error) : ""}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
