import * as React from "react";

import { useThrottleFn } from "../../../src";

function Case1() {
  const [value, setValue] = React.useState(0);
  const [processed, setProcessed] = React.useState(0);
  const action = useThrottleFn((n: number) => setProcessed(n), 500);
  return (
    <>
      <label>
        拖动预览值
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            setValue(n);
            action.run(n);
          }}
        />
      </label>
      <output>
        即时 {value} · 已处理 {processed}
      </output>
      <button onClick={() => action.flush()}>立即同步尾沿</button>
    </>
  );
}

export default Case1;
