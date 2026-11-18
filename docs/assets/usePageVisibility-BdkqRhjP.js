var e=`import * as React from "react";
import { usePageVisibility, useInterval } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const visibility = usePageVisibility();
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(0);
  useInterval(
    () => setCount((n) => n + 1),
    active && visibility === "visible" ? 500 : null,
  );
  return (
    <>
      <button onClick={() => setActive((v) => !v)}>
        {active ? "停止可见轮询" : "启动可见轮询"}
      </button>
      <output>
        {visibility} · 已轮询 {count} 次
      </output>
    </>
  );
}
function Case2() {
  const visibility = usePageVisibility();
  const previous = React.useRef(visibility);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (previous.current === "hidden" && visibility === "visible")
      setCount((n) => n + 1);
    previous.current = visibility;
  }, [visibility]);
  return (
    <>
      <output>
        返回页面 {count} 次 · {visibility}
      </output>
      <button onClick={() => setCount(0)}>清空返回记录</button>
      <p>请切换标签页后再回来。</p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="仅在可见时轮询"
        description="手动启动后切换标签页，页面隐藏时传入 null 暂停定时任务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="记录页面返回次数"
        description="切换到其他标签页再返回，记录从 hidden 到 visible 的真实变化。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};