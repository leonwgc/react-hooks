import * as React from "react";
import { useLocalStorageState } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const s = useLocalStorageState(
    "web-hooks:examples:useLocalStorageState:object",
    { count: 0, name: "访客" },
  );
  return (
    <>
      <button onClick={() => s.setValue((v) => ({ ...v, count: v.count + 1 }))}>
        增加持久计数
      </button>
      <button onClick={s.remove}>清除对象记录</button>
      <output>{JSON.stringify(s.value)}</output>
      {!!s.error && <p role="alert">{String(s.error)}</p>}
    </>
  );
}
function Case2() {
  const a = useLocalStorageState(
    "web-hooks:examples:useLocalStorageState:shared",
    0,
  );
  const b = useLocalStorageState(
    "web-hooks:examples:useLocalStorageState:shared",
    0,
  );
  return (
    <>
      <button onClick={() => a.setValue((n) => n + 1)}>从实例 A 加一</button>
      <button onClick={() => b.setValue((n) => n + 10)}>从实例 B 加十</button>
      <button onClick={a.remove}>清除共享值</button>
      <output>
        A {a.value} · B {b.value}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="对象状态与函数更新"
        description="将对象保存到独立演示键，累计更新后可清除，刷新页面观察持久化。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="同页两个实例同步"
        description="两个 Hook 使用同一个独立键，任一实例写入后另一个也会更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
