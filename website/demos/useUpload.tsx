import { useState } from "react";
import { useUpload, useDrop } from "../../src";
import { delay } from "./webHelpers";
export default function Demo() {
  const [fail, setFail] = useState(false);
  const upload = useUpload({
    concurrency: 2,
    transport: async ({ file, signal, onProgress }) => {
      for (let i = 1; i <= 5; i++) {
        await delay(signal, 220);
        onProgress(i, 5);
      }
      if (fail) throw new Error("模拟上传失败");
      return file.name;
    },
  });
  const drop = useDrop(({ files }) => upload.add(files));
  return (
    <div className="demo-stack">
      <p>
        本地模拟传输，文件不会发送到服务器。真实项目可注入
        createXHRUploadTransport。
      </p>
      <div {...drop.bind} className="notice">
        <label>
          选择文件
          <input
            type="file"
            multiple
            onChange={(e) => {
              upload.add(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
        {drop.over ? "松开放入文件" : "也可拖入文件"}
      </div>
      <label>
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => setFail(e.target.checked)}
        />
        模拟上传失败
      </label>
      <ul>
        {upload.uploads.map((item) => (
          <li key={item.id}>
            {item.file.name} · {item.status}
            <progress
              aria-label={`${item.file.name} 上传进度`}
              max={100}
              value={item.progress}
            />
            <button
              disabled={!["queued", "running"].includes(item.status)}
              onClick={() => upload.cancel(item.id)}
            >
              取消上传
            </button>
            <button
              disabled={!["error", "cancelled"].includes(item.status)}
              onClick={() => upload.retry(item.id)}
            >
              重试上传
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
