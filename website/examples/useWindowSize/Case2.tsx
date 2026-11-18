import * as React from "react";

import { useWindowSize } from "../../../src";

function Case2() {
  const size = useWindowSize();
  const [snapshot, setSnapshot] = React.useState("未记录");
  return (
    <>
      <button onClick={() => setSnapshot(`${size.width} × ${size.height}`)}>
        记录视口快照
      </button>
      <output>
        实时 {size.width} × {size.height} ·{" "}
        {size.width >= size.height ? "横向" : "纵向"}
      </output>
      <output>快照：{snapshot}</output>
      <p>调整浏览器窗口大小即可观察差异。</p>
    </>
  );
}

export default Case2;
