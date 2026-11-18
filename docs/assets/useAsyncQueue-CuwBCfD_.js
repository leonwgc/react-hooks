var e=`import * as React from "react";
import { useAsyncQueue } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
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
              \`批量任务 \${i + 1}\`,
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="动态并发与运行计数"
        description="新增四个任务，改变并发上限后观察等待任务的调度；降低上限不终止已运行任务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="单任务失败不阻断后续"
        description="失败任务记录 error，后续任务继续运行，结束后可以清理历史。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};