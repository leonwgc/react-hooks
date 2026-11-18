import * as React from "react";

import { useSpring } from "../../../src";

function Case2() {
  const [target, setTarget] = React.useState(0);
  const s = useSpring(target, { stiffness: 35, damping: 8 });
  return (
    <>
      <button onClick={() => setTarget(100)}>开始慢速弹簧</button>
      <button onClick={s.stop}>暂停弹簧</button>
      <button onClick={s.restart}>继续弹簧</button>
      <button onClick={s.finish}>吸附到目标</button>
      <output>
        {s.value.toFixed(1)} · {s.animating ? "动画中" : "停止"}
      </output>
    </>
  );
}

export default Case2;
