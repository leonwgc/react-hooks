import * as React from "react";

import { useDocumentTitle } from "../../../src";

function TemporaryTitle() {
  useDocumentTitle("临时预览标题");
  return <p>临时标题拥有者已挂载。</p>;
}

function Case2() {
  useDocumentTitle("场景父标题");
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "关闭临时标题" : "打开临时标题"}
      </button>
      {open && <TemporaryTitle />}
      <p>观察标签标题的接管与恢复。</p>
    </>
  );
}

export default Case2;
