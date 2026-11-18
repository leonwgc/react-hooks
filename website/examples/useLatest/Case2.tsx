import * as React from "react";

import { useLatest } from "../../../src";

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

export default Case2;
