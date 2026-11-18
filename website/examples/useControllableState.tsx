import * as React from "react";
import { useControllableState } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [parent, setParent] = React.useState(2);
  const [value, setValue] = useControllableState({
    value: parent,
    defaultValue: 0,
    onChange: setParent,
  });
  return (
    <>
      <button onClick={() => setValue((v) => Math.min(5, v + 1))}>
        评分加一
      </button>
      <button onClick={() => setParent(0)}>父级清零</button>
      <output>
        子级 {value} / 父级 {parent}
      </output>
    </>
  );
}
function Case2() {
  const [parent, setParent] = React.useState(1);
  const [accept, setAccept] = React.useState(false);
  const [proposed, setProposed] = React.useState(1);
  const [value, setValue] = useControllableState({
    value: parent,
    defaultValue: 0,
    onChange: (next) => {
      setProposed(next);
      if (accept) setParent(next);
    },
  });
  return (
    <>
      <button onClick={() => setAccept((v) => !v)}>
        {accept ? "停止回写" : "允许回写"}
      </button>
      <button onClick={() => setValue((v) => v + 1)}>请求加一</button>
      <output>
        当前值 {value} · 最近请求 {proposed}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="父级控制的评分"
        description="子级提出新值，由父级 onChange 写回；父级也可以直接重置值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="受控值需要回写"
        description="切换是否接受子组件的变更，观察回调通知和实际受控值的区别。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
