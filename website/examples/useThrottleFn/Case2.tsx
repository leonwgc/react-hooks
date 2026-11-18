import * as React from "react";

import { useThrottleFn } from "../../../src";

function Case2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const action = useThrottleFn(
    (value: string) => setEvents((s) => [...s, value]),
    1000,
  );
  return (
    <>
      <button
        onClick={() => {
          action.run("首条");
          action.run("尾条");
        }}
      >
        连续提交两条
      </button>
      <button onClick={action.cancel}>取消尾条</button>
      <button onClick={() => action.run("新窗口")}>提交新窗口</button>
      <output>{events.join(" → ") || "尚未执行"}</output>
    </>
  );
}

export default Case2;
