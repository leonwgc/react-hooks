import * as React from "react";

import { useMediaQuery } from "../../../src";

function Case1() {
  const [width, setWidth] = React.useState(800);
  const matches = useMediaQuery(`(min-width: ${width}px)`);
  return (
    <>
      <label>
        断点宽度
        <input
          type="range"
          min={300}
          max={1600}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <output>
        窗口 ≥ {width}px：{matches ? "匹配" : "不匹配"}
      </output>
    </>
  );
}

export default Case1;
