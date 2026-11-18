import * as React from "react";

import { usePageVisibility } from "../../../src";

function Case2() {
  const visibility = usePageVisibility();
  const previous = React.useRef(visibility);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (previous.current === "hidden" && visibility === "visible")
      setCount((n) => n + 1);
    previous.current = visibility;
  }, [visibility]);
  return (
    <>
      <output>
        返回页面 {count} 次 · {visibility}
      </output>
      <button onClick={() => setCount(0)}>清空返回记录</button>
      <p>请切换标签页后再回来。</p>
    </>
  );
}

export default Case2;
