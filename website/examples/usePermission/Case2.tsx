import * as React from "react";

import { usePermission } from "../../../src";

function Case2() {
  const [allowed, setAllowed] = React.useState<string[]>([]);
  const p = usePermission(allowed);
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button onClick={() => setAllowed(["export"])}>授予导出权限</button>
      <button onClick={() => setAllowed([])}>撤销导出权限</button>
      <button
        disabled={!p.has("export")}
        onClick={() => setCount((n) => n + 1)}
      >
        执行演示导出
      </button>
      <output>已导出 {count} 次</output>
    </>
  );
}

export default Case2;
