import { useDownload } from "../../src";
export default function Demo() {
  const download = useDownload();
  return (
    <div className="demo-stack">
      <button
        disabled={download.loading}
        onClick={() =>
          void download
            .download(
              new Blob(["由 Web Hooks 生成的示例文件\n"], {
                type: "text/plain;charset=utf-8",
              }),
              "web-hooks-demo.txt",
            )
            .catch(() => {})
        }
      >
        下载示例文本
      </button>
      {!!download.error && <p role="alert">{String(download.error)}</p>}
      <small>在浏览器本地生成 Blob；URL 下载则支持 HTTP 错误与取消。</small>
    </div>
  );
}
