var e=`import * as React from "react";
import { useUpload } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
function Case1() {
  const [message, setMessage] = React.useState("等待文件");
  const u = useUpload({
    concurrency: 1,
    transport: async ({ file, signal, onProgress }) => {
      await delay(signal, 300);
      onProgress(file.size, file.size);
      return file.name;
    },
  });
  const add = (files: File[]) => {
    const valid = files.filter((f) => f.size <= 1024);
    setMessage(\`接受 \${valid.length} / \${files.length} 个文件（上限 1KB）\`);
    u.add(valid);
  };
  return (
    <>
      <label>
        校验上传文件
        <input
          type="file"
          multiple
          onChange={(e) => add(Array.from(e.target.files ?? []))}
        />
      </label>
      <button
        onClick={() =>
          add([
            new File(["demo"], "small.txt"),
            new File(["x".repeat(2048)], "large.txt"),
          ])
        }
      >
        加入大小不同的示例文件
      </button>
      <output>{message}</output>
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
          u.add([1, 2, 3].map((n) => new File(["demo"], \`queue-\${n}.txt\`)))
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="上传前校验与批量加入"
        description="在调用 add 前检查文件大小；按钮创建小型本地示例文件，传输完全在内存模拟。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="暂停排队与恢复传输"
        description="暂停只阻止新任务启动，正在进行的任务继续；可取消全部并清除已结束任务。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};