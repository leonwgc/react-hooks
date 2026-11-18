import * as React from "react";

import { useReducedMotion } from "../../../src";

function Case2() {
  const reduced = useReducedMotion();
  const [done, setDone] = React.useState(false);
  return (
    <>
      <button onClick={() => setDone((v) => !v)}>切换完成状态</button>
      <div
        className="notice"
        style={{
          transform: !reduced && done ? "translateX(20px)" : "none",
          transition: reduced ? "none" : "transform 300ms",
          color: done ? "var(--accent)" : "var(--text)",
        }}
      >
        {done ? "已完成" : "待完成"}
      </div>
      <output>系统偏好：{reduced ? "减少运动" : "允许运动"}</output>
    </>
  );
}

export default Case2;
