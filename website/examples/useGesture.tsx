import * as React from "react";
import { useGesture } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const g = useGesture({ axis: "y", threshold: 6 });
  return (
    <>
      <div {...g.bind} className="pointer-pad" aria-label="垂直手势区域">
        在区域内上下拖动
      </div>
      <button onClick={g.cancel}>取消当前拖动</button>
      <button onClick={g.reset}>清零手势位移</button>
      <output>
        X {Math.round(g.offset.x)} / Y {Math.round(g.offset.y)} ·{" "}
        {g.dragging ? "拖动中" : "未拖动"}
      </output>
    </>
  );
}
function Case2() {
  const [disabled, setDisabled] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const action = () => setCount((n) => n + 1);
  const g = useGesture({
    disabled,
    onEnd: (s) => {
      if (s.swipe) action();
    },
  });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用手势" : "禁用手势"}
      </button>
      <div {...g.bind} className="pointer-pad" aria-label="可禁用滑动区域">
        任意方向滑动超过 40px 计一次
      </div>
      <button onClick={action}>键盘执行同一操作</button>
      <output>
        业务操作 {count} 次 · {disabled ? "手势已停用" : "手势可用"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="受限拖动轴与取消"
        description="只输出垂直位移，水平分量保持为零；取消后保留位移，重置归零。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="禁用手势与业务等价按钮"
        description="禁用后不再开始新手势，业务操作仍可通过键盘按钮完成。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
