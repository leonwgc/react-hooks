import * as React from "react";

import { useClickOutside } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(true);
  const [enabled, setEnabled] = React.useState(true);
  useClickOutside(ref, () => setOpen(false), enabled);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用外部关闭" : "启用外部关闭"}
      </button>
      <div ref={ref}>
        <button onClick={() => setOpen(true)}>展开浮层</button>
        {open && <p className="notice">面板内容</p>}
      </div>
      <button>点击这里属于外部</button>
      <output>{open ? "浮层打开" : "浮层关闭"}</output>
    </>
  );
}

export default Case1;
