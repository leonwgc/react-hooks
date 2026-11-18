import { useUpload } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const u = useUpload({
    concurrency: 1,
    transport: async ({ file, signal, onProgress }) => {
      for (let i = 1; i <= 4; i++) {
        await delay(signal, 250);
        onProgress(i, 4);
      }
      return file.name;
    },
  });
  return (
    <>
      <button
        onClick={() =>
          u.add([1, 2, 3].map((n) => new File(["demo"], `queue-${n}.txt`)))
        }
      >
        加入三个模拟上传
      </button>
      <button onClick={u.paused ? u.resume : u.pause}>
        {u.paused ? "恢复上传调度" : "暂停上传调度"}
      </button>
      <button onClick={u.cancelAll}>取消所有上传任务</button>
      <button onClick={u.clear}>清理上传历史</button>
      <ul>
        {u.uploads.map((t) => (
          <li key={t.id}>
            {t.file.name}：{t.status} · {t.progress}%
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
