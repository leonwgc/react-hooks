var e=`import * as React from "react";
import { useClickOutside } from "../../src";
import { Scenario } from "./Scenario";

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
function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [log, setLog] = React.useState("尚未外部点击");
  useClickOutside(ref, (e) =>
    setLog(
      "外部目标：" +
        (e.target instanceof HTMLElement ? e.target.tagName : "未知"),
    ),
  );
  return (
    <>
      <div ref={ref} className="notice">
        <button>内部按钮不会触发</button>
      </div>
      <button>外部按钮触发记录</button>
      <output>{log}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="暂停外部关闭"
        description="关闭监听后点击外部区域不再关闭面板。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="记录外部点击来源"
        description="读取原生 PointerEvent，区分目标内部和外部触发。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};