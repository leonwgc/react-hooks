import { useReducedMotion } from "../../src";

export default function Demo() {
  const reduced = useReducedMotion();
  return (
    <div className="demo-stack">
      <output>{reduced ? "已启用：减少动态效果" : "允许完整动画"}</output>
      <p>跟随系统辅助功能设置，动画组件可据此降低或关闭运动效果。</p>
    </div>
  );
}
