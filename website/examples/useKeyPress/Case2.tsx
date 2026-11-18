import * as React from "react";

import { useKeyPress } from "../../../src";

function Case2() {
  const scope = React.useRef<HTMLDivElement>(null);
  const [key, setKey] = React.useState("等待快捷键");
  useKeyPress(["alt+j", "alt+l"], (e) => setKey(e.key), {
    scope,
    allowInInput: true,
    preventDefault: true,
    repeat: false,
  });
  return (
    <div ref={scope}>
      <label>
        命令输入区
        <input placeholder="按 Alt+J 或 Alt+L" />
      </label>
      <output>最近命令：{key}</output>
    </div>
  );
}

export default Case2;
