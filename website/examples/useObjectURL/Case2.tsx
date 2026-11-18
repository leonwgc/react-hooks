import * as React from "react";

import { useObjectURL } from "../../../src";

function Case2() {
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [count, setCount] = React.useState(0);
  const value = useObjectURL(blob);
  return (
    <>
      <button
        onClick={() => {
          setCount((n) => n + 1);
          setBlob(new Blob([`版本 ${count + 1}`], { type: "text/plain" }));
        }}
      >
        生成下一版文本 Blob
      </button>
      <button onClick={() => setBlob(null)}>清空对象 URL</button>
      <output>{value.url ?? "URL 已释放"}</output>
      {!!value.error && <p role="alert">{String(value.error)}</p>}
    </>
  );
}

export default Case2;
