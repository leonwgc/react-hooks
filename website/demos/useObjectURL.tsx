import { useState } from "react";
import { useObjectURL } from "../../src";
export default function Demo() {
  const [file, setFile] = useState<Blob | null>(null);
  const result = useObjectURL(file);
  return (
    <div className="demo-stack">
      <button
        onClick={() =>
          setFile(new Blob(["本地文本预览"], { type: "text/plain" }))
        }
      >
        生成 Blob 地址
      </button>
      <button onClick={() => setFile(null)}>释放 Blob 地址</button>
      <output style={{ overflowWrap: "anywhere" }}>
        {result.url ?? "未创建地址"}
      </output>
      {result.url && (
        <a href={result.url} target="_blank" rel="noreferrer">
          打开本地文本
        </a>
      )}
      {!!result.error && <p role="alert">{String(result.error)}</p>}
    </div>
  );
}
