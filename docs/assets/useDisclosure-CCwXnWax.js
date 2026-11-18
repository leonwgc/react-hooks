var e=`import * as React from "react";
import { useDisclosure } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const panel = useDisclosure(true);
  return (
    <>
      <button onClick={panel.toggle} aria-expanded={panel.isOpen}>
        切换帮助内容
      </button>
      <button onClick={panel.open}>始终展开</button>
      {panel.isOpen && <p className="notice">这里是帮助说明。</p>}
      <output>{panel.isOpen ? "展开" : "收起"}</output>
    </>
  );
}
function Case2() {
  const a = useDisclosure();
  const b = useDisclosure();
  return (
    <>
      <button
        onClick={() => {
          a.open();
          b.close();
        }}
      >
        查看规格
      </button>
      <button
        onClick={() => {
          b.open();
          a.close();
        }}
      >
        查看配送
      </button>
      <button
        onClick={() => {
          a.close();
          b.close();
        }}
      >
        关闭全部面板
      </button>
      {a.isOpen && <p>规格：轻量便携</p>}
      {b.isOpen && <p>配送：次日发货</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="默认展开的帮助面板"
        description="通过初始状态控制首次展示，重复打开保持展开。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="互斥的详情面板"
        description="组合两个独立实例，在打开一个时关闭另一个。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};