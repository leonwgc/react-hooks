import * as React from "react";

import { useLatest } from "../../../src";

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

export default Case1;
