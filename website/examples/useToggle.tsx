import * as React from "react";
import { useToggle } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const zoom = useToggle(100, 150);
  return (
    <>
      <button onClick={zoom.toggle}>切换缩放</button>
      <button onClick={() => zoom.setValue(100)}>恢复 100%</button>
      <output>缩放：{zoom.value}%</output>
      <p style={{ fontSize: zoom.value / 100 + "em" }}>可缩放的预览文字</p>
    </>
  );
}
function Case2() {
  const [first] = React.useState({ name: "简洁", columns: 1 });
  const [second] = React.useState({ name: "丰富", columns: 3 });
  const state = useToggle(first, second);
  return (
    <>
      <button onClick={state.toggle}>切换预设</button>
      <button onClick={() => state.setValue({ name: "自定义", columns: 2 })}>
        设置自定义预设
      </button>
      <output>
        {state.value.name} · {state.value.columns} 列
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="数字缩放档位"
        description="在 100% 和 150% 两个数字值之间切换，也可以直接指定一个档位。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="对象预设与自定义值"
        description="对象按引用比较；手动设置第三个值后再次切换会回到第一个预设。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
