import * as React from "react";

import { useClipboard } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(1);
  const c = useClipboard();
  const text = JSON.stringify({ product: "Hooks", quantity: count }, null, 2);
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>增加数量</button>
      <pre>{text}</pre>
      <button onClick={() => void c.copy(text)}>复制 JSON</button>
      <output>{c.copied ? "JSON 已复制" : "等待复制 JSON"}</output>
      {!!c.error && <p role="alert">当前环境无法复制，请选择上方 JSON。</p>}
    </>
  );
}

export default Case2;
