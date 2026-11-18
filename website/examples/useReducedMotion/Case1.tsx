import * as React from "react";

import { useReducedMotion } from "../../../src";

function Case1() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>切换偏好感知面板</button>
      <div
        className="notice"
        style={{
          opacity: open ? 1 : 0.25,
          transition: reduced ? "none" : "opacity 600ms",
        }}
      >
        偏好感知内容
      </div>
      <output>{reduced ? "无过渡" : "600ms 淡入淡出"}</output>
    </>
  );
}

export default Case1;
