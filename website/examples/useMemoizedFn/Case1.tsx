import * as React from "react";

import { useMemoizedFn } from "../../../src";

function Case1() {
  const [factor, setFactor] = React.useState(2);
  const [result, setResult] = React.useState(0);
  const multiply = useMemoizedFn((n: number) => n * factor);
  return (
    <>
      <label>
        倍率
        <input
          type="number"
          value={factor}
          onChange={(e) => setFactor(Number(e.target.value))}
        />
      </label>
      <button onClick={() => setResult(multiply(5))}>计算 5 × 倍率</button>
      <output>结果：{result}</output>
    </>
  );
}

export default Case1;
