import * as React from "react";

import { useAsyncAction } from "../../../src";

function Case1() {
  const action = useAsyncAction(async (fail: boolean) => {
    await new Promise((r) => setTimeout(r, 300));
    if (fail) throw Error("演示提交失败");
    return "提交成功";
  });
  const [result, setResult] = React.useState("等待提交");
  const run = (fail: boolean) => {
    void action
      .run(fail)
      .then(setResult)
      .catch(() => setResult("请重试"));
  };
  return (
    <>
      <button disabled={action.loading} onClick={() => run(true)}>
        提交失败请求
      </button>
      <button disabled={action.loading} onClick={() => run(false)}>
        重试成功请求
      </button>
      <output>{action.loading ? "提交中" : result}</output>
      {!!action.error && <p role="alert">{String(action.error)}</p>}
    </>
  );
}

export default Case1;
