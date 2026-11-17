import { useAsyncQueue } from "../../src";
import { delay } from "./webHelpers";
export default function Demo() {
  const queue = useAsyncQueue<string>({ concurrency: 2 });
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button
          onClick={() => {
            for (let i = 1; i <= 5; i++)
              queue.add(async (signal) => {
                await delay(signal, 1000);
                return "完成";
              }, `任务 ${i}`);
          }}
        >
          加入 5 个任务
        </button>
        <button onClick={queue.paused ? queue.resume : queue.pause}>
          {queue.paused ? "恢复队列" : "暂停队列"}
        </button>
        <button onClick={queue.cancelAll}>全部取消</button>
        <button onClick={queue.clear}>清除已结束</button>
      </div>
      <output>
        运行 {queue.running} / 等待 {queue.pending}
      </output>
      <ul>
        {queue.tasks.map((task) => (
          <li key={task.id}>
            {task.label} · {task.status}{" "}
            <button
              disabled={!["queued", "running"].includes(task.status)}
              onClick={() => queue.cancel(task.id)}
            >
              取消任务
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
