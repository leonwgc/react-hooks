import * as React from "react";

import { useUpload } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature1() {
  const [message, setMessage] = React.useState("等待文件");
  const failures = React.useRef(new Set<string>());
  const u = useUpload({
    concurrency: 1,
    capacity: 2,
    transport: async ({ file, signal, onProgress }) => {
      for (let step = 1; step <= 4; step++) {
        await delay(signal, 150);
        onProgress(step, 4);
      }
      // Each "flaky" file fails exactly once so the retry can succeed.
      if (file.name.startsWith("flaky") && !failures.current.has(file.name)) {
        failures.current.add(file.name);
        throw new Error("网络中断");
      }
      return file.name;
    },
  });
  const add = () => {
    const handles = u.add([
      new File(["a"], `flaky-${Date.now()}.txt`),
      new File(["b"], "stable.txt"),
      new File(["c"], "overflow.txt"),
    ]);
    const rejected = handles.filter((h) => !h.accepted).length;
    setMessage(
      `接受 ${handles.length - rejected} 个，因容量上限拒绝 ${rejected} 个`,
    );
  };
  return (
    <>
      <button onClick={add}>一次加入 3 个文件（容量 2）</button>
      <output>{message}</output>
      <ul>
        {u.uploads.map((t) => (
          <li key={t.id}>
            {t.file.name}：{t.status} · {Math.round(t.progress)}%
            {t.status === "error" && (
              <button className="secondary" onClick={() => u.retry(t.id)}>
                重试（替换此行）
              </button>
            )}
          </li>
        ))}
      </ul>
      <button className="secondary" onClick={u.clear}>
        清除已结束记录
      </button>
    </>
  );
}

export default Feature1;
