import * as React from "react";

import { useDebounce } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("");
  const [wait, setWait] = React.useState(300);
  const value = useDebounce(text, wait);
  return (
    <>
      <label>
        预览内容
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        等待毫秒
        <select value={wait} onChange={(e) => setWait(Number(e.target.value))}>
          <option value={0}>0</option>
          <option value={300}>300</option>
          <option value={1000}>1000</option>
        </select>
      </label>
      <output>
        即时：{text} / 稳定：{value}
      </output>
    </>
  );
}

export default Case1;
