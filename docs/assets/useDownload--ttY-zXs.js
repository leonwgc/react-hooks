var e=`import * as React from "react";
import { useDownload } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [count, setCount] = React.useState(1);
  const d = useDownload();
  return (
    <>
      <label>
        报表数量
        <input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() =>
          void d
            .download(
              new Blob(["﻿名称,数量\\nHooks," + count], {
                type: "text/csv;charset=utf-8",
              }),
              "hooks-report.csv",
            )
            .catch(() => {})
        }
      >
        下载 CSV 报表
      </button>
      {!!d.error && <p role="alert">{String(d.error)}</p>}
    </>
  );
}
function Case2() {
  const d = useDownload();
  const [result, setResult] = React.useState("未下载");
  const run = (cancel: boolean) => {
    const pending = d.download(
      "data:text/plain;charset=utf-8,Hello%20Hooks",
      "url-demo.txt",
    );
    if (cancel) d.cancel();
    void pending
      .then(() => setResult("已交给浏览器保存"))
      .catch(() => setResult(cancel ? "已取消下载" : "下载失败"));
  };
  return (
    <>
      <button onClick={() => run(false)}>下载 URL 文本</button>
      <button onClick={() => run(true)}>启动并立即取消</button>
      <output>{d.loading ? "下载中" : result}</output>
      {!!d.error && <p role="alert">{String(d.error)}</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="本地生成 CSV 报表"
        description="修改数量后下载本地 CSV，演示数据不经过服务器。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="URL 下载与立即取消"
        description="使用本地 data URL 演示 fetch 路径；立即取消会阻止保存，无需请求外部服务器。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};