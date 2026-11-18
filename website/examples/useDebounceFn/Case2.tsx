import * as React from "react";

import { useDebounceFn } from "../../../src";

function Case2() {
  const [result, setResult] = React.useState("无");
  const action = useDebounceFn((value: string) => {
    setResult(value);
    return value;
  }, 800);
  return (
    <>
      <button
        onClick={() => {
          action.run("A");
          action.run("B");
          action.run("C");
        }}
      >
        连续提交 A / B / C
      </button>
      <button onClick={() => action.flush()}>立即处理最后一项</button>
      <button onClick={action.cancel}>撤销待处理项</button>
      <output>处理结果：{result}</output>
    </>
  );
}

export default Case2;
