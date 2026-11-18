import * as React from "react";

import { useDocumentTitle } from "../../../src";

function Case1() {
  const [count, setCount] = React.useState(0);
  useDocumentTitle(count ? `(${count}) 新消息` : "消息中心");
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>收到一条演示消息</button>
      <button onClick={() => setCount(0)}>标记全部已读</button>
      <output>未读 {count} 条，查看浏览器标题。</output>
    </>
  );
}

export default Case1;
