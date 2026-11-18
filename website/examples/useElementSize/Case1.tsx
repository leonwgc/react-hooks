import * as React from "react";

import { useElementSize } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(70);
  const size = useElementSize(ref);
  return (
    <>
      <label>
        容器宽度百分比
        <input
          type="range"
          min={30}
          max={100}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div
        ref={ref}
        className="notice"
        style={{ width: width + "%", boxSizing: "border-box" }}
      >
        尺寸观察区域
      </div>
      <output>
        {Math.round(size.width)} × {Math.round(size.height)} px
      </output>
    </>
  );
}

export default Case1;
