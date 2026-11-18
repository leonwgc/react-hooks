import * as React from "react";

import { useClipboard } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("可编辑的分享内容");
  const c = useClipboard();
  return (
    <>
      <label>
        待复制文本
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button onClick={() => void c.copy(text)}>复制当前文本</button>
      <output>{c.copied ? "复制成功" : "尚未复制"}</output>
      {!!c.error && <p role="alert">复制失败，请手动选择文本。</p>}
    </>
  );
}

export default Case1;
