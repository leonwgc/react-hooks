import { usePageVisibility } from "../../src";

export default function Demo() {
  const visibility = usePageVisibility();
  return (
    <div className="demo-stack">
      <output className="large-value">
        {visibility === "visible" ? "页面可见" : "页面隐藏"}
      </output>
      <p>切换标签页会更新状态，可用于暂停轮询或动画。</p>
    </div>
  );
}
