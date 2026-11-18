import * as React from "react";
import { useAsyncAction } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="错误后重新提交"
        description="第一次主动模拟失败，下一次传入成功参数，观察错误状态清空。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="并发调用共享结果"
        description="同一事件中连续调用两次，观察 Promise 引用相同且只执行一个任务。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
