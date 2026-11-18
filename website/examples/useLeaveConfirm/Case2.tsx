import * as React from "react";

import { useLeaveConfirm } from "../../../src";

function Case2() {
  const [dirty, setDirty] = React.useState(false);
  const [result, setResult] = React.useState("尚未离开");
  const leave = useLeaveConfirm(dirty, {
    confirm: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return false;
    },
  });
  return (
    <>
      <button onClick={() => setDirty(true)}>产生修改</button>
      <button onClick={() => setDirty(false)}>保存修改</button>
      <button
        onClick={() =>
          void leave
            .confirmLeave()
            .then((ok) => setResult(ok ? "可以离开" : "需要先保存"))
        }
      >
        检查能否离开
      </button>
      <output>
        {dirty ? "未保存" : "已保存"} · {result}
      </output>
    </>
  );
}

export default Case2;
