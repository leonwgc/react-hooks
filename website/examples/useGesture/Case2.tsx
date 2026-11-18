import * as React from "react";

import { useGesture } from "../../../src";

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

export default Case2;
