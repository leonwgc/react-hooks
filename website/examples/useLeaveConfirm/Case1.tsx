import * as React from "react";

import { useLeaveConfirm } from "../../../src";

function Case1() {
  const [allow, setAllow] = React.useState(false);
  const [result, setResult] = React.useState("等待导航");
  const leave = useLeaveConfirm(true, { confirm: () => allow });
  return (
    <>
      <button onClick={() => setAllow((v) => !v)}>
        {allow ? "改为拒绝离开" : "改为允许离开"}
      </button>
      <button
        onClick={() =>
          void leave
            .guard(() => setResult("已执行导航"))
            .then((ok) => {
              if (!ok) setResult("已保留编辑");
            })
        }
      >
        尝试页内导航
      </button>
      <output>{result}</output>
    </>
  );
}

export default Case1;
