var e=`import * as React from "react";
import { useLatest } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [text, setText] = React.useState("初稿");
  const latest = useLatest(text);
  const [read, setRead] = React.useState("未读取");
  const bus = React.useRef(new EventTarget());
  React.useEffect(() => {
    const read = () => setRead(latest.current);
    const target = bus.current;
    target.addEventListener("read", read);
    return () => target.removeEventListener("read", read);
  }, [latest]);
  return (
    <>
      <label>
        最新草稿
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button onClick={() => bus.current.dispatchEvent(new Event("read"))}>
        触发长期订阅
      </button>
      <output>{read}</output>
    </>
  );
}
function Case2() {
  const [value, setValue] = React.useState("输入值");
  const ref = useLatest(value);
  const [log, setLog] = React.useState("未读取");
  return (
    <>
      <label>
        传入值
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button
        onClick={() => {
          ref.current = "临时值";
          setLog("事件内读取：" + ref.current);
        }}
      >
        事件内修改引用
      </button>
      <button onClick={() => setLog("重新读取：" + ref.current)}>
        读取同步后的引用
      </button>
      <output>{log}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="长期订阅读取最新草稿"
        description="事件监听只安装一次，修改输入后触发事件仍能读到最新内容。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="引用更新不主动渲染"
        description="在事件中暂存 ref 值并读取；下一次渲染会再次同步传入值。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};