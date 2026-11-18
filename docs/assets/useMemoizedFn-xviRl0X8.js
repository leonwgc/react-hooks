var e=`import * as React from "react";
import { useMemoizedFn } from "../../src";
import { Scenario } from "./Scenario";

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
function Case2() {
  const [prefix, setPrefix] = React.useState("欢迎");
  const [log, setLog] = React.useState("等待事件");
  const bus = React.useRef(new EventTarget());
  const handler = useMemoizedFn(() => setLog(prefix + "，访客"));
  React.useEffect(() => {
    const target = bus.current;
    target.addEventListener("hello", handler);
    return () => target.removeEventListener("hello", handler);
  }, [handler]);
  return (
    <>
      <label>
        问候前缀
        <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
      </label>
      <button onClick={() => bus.current.dispatchEvent(new Event("hello"))}>
        发送问候事件
      </button>
      <output>{log}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="参数与返回值透传"
        description="改变倍率后，稳定函数会使用最新倍率计算并返回结果。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="订阅无需重新绑定"
        description="局部事件源只绑定一次，改变前缀后事件处理函数仍使用最新文案。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};