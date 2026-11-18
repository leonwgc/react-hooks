var e=`import * as React from "react";
import { useReducedMotion } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="按系统偏好切换过渡"
        description="展开面板时，系统要求减少动画则立即切换；可在系统设置或浏览器媒体模拟中改变偏好。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="交互触发的动画替代"
        description="完整模式移动位置，减少动态模式仅改变文字和颜色，不强制开启运动。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};