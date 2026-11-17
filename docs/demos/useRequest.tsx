import { useState } from "react";
import { useRequest } from "../../src";

export default function Demo() {
  const [fail, setFail] = useState(false);
  const request = useRequest(async ({ signal }, shouldFail: boolean) => {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, 700);
      function abort() {
        clearTimeout(timer);
        reject(new DOMException("Cancelled", "AbortError"));
      }
      signal.addEventListener("abort", abort, { once: true });
    });
    if (shouldFail)
      throw new Error("模拟服务暂时不可用，请关闭失败开关后重试。");
    return {
      title: "构建更好的 Web 体验",
      author: "Web Hooks",
      updatedAt: new Date().toLocaleTimeString(),
    };
  });
  return (
    <div className="demo-stack">
      <label className="check">
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => setFail(e.target.checked)}
        />
        模拟请求失败
      </label>
      <div className="demo-row">
        <button onClick={() => request.run(fail)}>
          {request.loading ? "重新请求" : "获取文章"}
        </button>
        <button className="secondary" onClick={request.cancel}>
          取消
        </button>
      </div>
      <div className="result-panel" aria-live="polite">
        {request.loading ? (
          <span>正在获取数据…</span>
        ) : request.error ? (
          <div role="alert">
            <p>{String(request.error)}</p>
            <button onClick={() => request.run(fail)}>重试</button>
          </div>
        ) : request.data ? (
          <>
            <small>
              {request.data.author} · {request.data.updatedAt}
            </small>
            <h3>{request.data.title}</h3>
            <span className="status-chip">请求成功</span>
          </>
        ) : (
          <span>点击按钮发起请求，体验加载、错误与取消。</span>
        )}
      </div>
    </div>
  );
}
