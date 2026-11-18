import * as React from "react";

import { useUpload } from "../../../src";

import { delay } from "../../demos/webHelpers";

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
    setMessage(`接受 ${valid.length} / ${files.length} 个文件（上限 1KB）`);
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

export default Case1;
