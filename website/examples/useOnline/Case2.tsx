import * as React from "react";

import { useOnline } from "../../../src";

function Case2() {
  const online = useOnline();
  const [result, setResult] = React.useState("尚未读取");
  return (
    <>
      <button
        onClick={() =>
          setResult(
            online ? "在线分支：最新演示数据" : "离线分支：本地缓存数据",
          )
        }
      >
        按网络状态读取
      </button>
      <output>{result}</output>
      <p>切换 Offline 后再次读取，观察缓存分支。</p>
    </>
  );
}

export default Case2;
