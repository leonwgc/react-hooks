import * as React from "react";

import { useAsyncAction } from "../../../src";

function Case2() {
  const count = React.useRef(0);
  const action = useAsyncAction(async (value: string) => {
    count.current++;
    await new Promise((r) => setTimeout(r, 200));
    return value;
  });
  const [result, setResult] = React.useState("未调用");
  return (
    <>
      <button
        disabled={action.loading}
        onClick={() => {
          const a = action.run("第一组参数");
          const b = action.run("第二组参数");
          void Promise.all([a, b]).then(([value]) =>
            setResult(
              `同一 Promise：${a === b}；结果：${value}；实际执行 ${count.current} 次`,
            ),
          );
        }}
      >
        同时提交两次
      </button>
      <output>{result}</output>
    </>
  );
}

export default Case2;
