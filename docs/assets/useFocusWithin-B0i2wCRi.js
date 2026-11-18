var e=`import * as React from "react";
import { useFocusWithin } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const f = useFocusWithin();
  return (
    <>
      <fieldset {...f.bind}>
        <legend>组合地址</legend>
        <label>
          城市
          <input />
        </label>
        <label>
          街道
          <input />
        </label>
        {f.focused && <p>可用 Tab 在地址字段间切换。</p>}
      </fieldset>
      <button>聚焦区域外</button>
      <output>{f.focused ? "正在填写地址" : "地址区域未聚焦"}</output>
    </>
  );
}
function Case2() {
  const a = useFocusWithin();
  const b = useFocusWithin();
  return (
    <>
      <div {...a.bind}>
        <label>
          主标题
          <input />
        </label>
        <output>主区域：{String(a.focused)}</output>
      </div>
      <div {...b.bind}>
        <label>
          副标题
          <input />
        </label>
        <output>副区域：{String(b.focused)}</output>
      </div>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="聚焦提示与外部控件"
        description="在组内多个输入之间切换焦点不会退出区域，聚焦外部按钮会隐藏提示。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="两个独立焦点区域"
        description="每个区域独立追踪；从一个区域切换到另一个不会互相混淆。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};