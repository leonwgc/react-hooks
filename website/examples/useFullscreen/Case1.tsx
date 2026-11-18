import * as React from "react";

import { useFullscreen } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p>数据展示面板</p>
      <button disabled={!f.supported} onClick={() => void f.enter()}>
        全屏显示面板
      </button>
      <button onClick={() => void f.exit()}>退出面板全屏</button>
      <output>
        {f.active ? "面板全屏中" : f.supported ? "普通模式" : "浏览器不支持"}
      </output>
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}

export default Case1;
