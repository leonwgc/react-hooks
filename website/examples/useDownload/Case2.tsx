import * as React from "react";

import { useDownload } from "../../../src";

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

export default Case2;
