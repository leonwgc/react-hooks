import * as React from "react";

import { useMemoizedFn } from "../../../src";

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

export default Case2;
