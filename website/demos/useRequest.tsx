import { useState, useRef } from "react";
import { useRequest } from "../../src";
import { delay } from "./webHelpers";

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
      <AdvancedRequest />
    </div>
  );
}

function AdvancedRequest() {
  const attempts = useRef(0);
  const [slow, setSlow] = useState(false);
  const [auto, setAuto] = useState(false);
  const request = useRequest(
    async ({ signal }, timeoutDemo: boolean) => {
      const attempt = ++attempts.current;
      await delay(signal, timeoutDemo ? 1200 : 150);
      if (attempt < 3) throw new Error("暂时失败，等待自动重试");
      return `第 ${attempt} 次尝试成功`;
    },
    {
      retry: 2,
      retryDelay: (n) => n * 300,
      timeout: 700,
      refreshOnFocus: auto,
      refreshOnReconnect: auto,
      pollingWhenHidden: false,
    },
  );
  return (
    <section className="demo-stack">
      <h3>重试、超时与自动刷新</h3>
      <label className="check">
        <input
          type="checkbox"
          checked={slow}
          onChange={(e) => setSlow(e.target.checked)}
        />
        模拟每次请求超时
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={auto}
          onChange={(e) => setAuto(e.target.checked)}
        />
        聚焦或网络恢复时刷新
      </label>
      <div className="demo-row">
        <button
          onClick={() => {
            attempts.current = 0;
            request.run(slow);
          }}
        >
          运行高级请求
        </button>
        <button onClick={request.cancel}>停止高级请求</button>
      </div>
      <output>
        重试次数：{request.retryCount} ·{" "}
        {request.loading
          ? "请求或退避等待中"
          : request.error
            ? String(request.error)
            : (request.data ?? "等待运行")}
      </output>
      <small>
        默认先失败两次，自动退避后成功。重试必须显式开启；写请求请先确保幂等性。
      </small>
    </section>
  );
}
