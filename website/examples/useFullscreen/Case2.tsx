import * as React from "react";

import { useFullscreen } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p style={{ fontSize: f.active ? 24 : 14 }}>
        专注阅读：全屏只改变显示方式，不改变文章数据。
      </p>
      <button disabled={!f.supported} onClick={() => void f.toggle()}>
        {f.active ? "结束专注阅读" : "开始专注阅读"}
      </button>
      {!f.supported && <p>当前环境不支持全屏。</p>}
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}

export default Case2;
