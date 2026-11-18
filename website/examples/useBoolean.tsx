import * as React from "react";
import { useBoolean } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const visible = useBoolean();
  return (
    <>
      <label>
        演示密码
        <input
          type={visible.value ? "text" : "password"}
          defaultValue="demo-password"
        />
      </label>
      <button onClick={visible.toggle}>
        {visible.value ? "隐藏密码" : "显示密码"}
      </button>
    </>
  );
}
function Case2() {
  const state = useBoolean(true);
  return (
    <>
      <div className="demo-row">
        <button onClick={state.setTrue}>启用功能</button>
        <button onClick={state.setFalse}>停用功能</button>
        <button onClick={() => state.setValue((v) => !v)}>函数式反转</button>
      </div>
      <output>{state.value ? "功能已启用" : "功能已停用"}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="密码显示开关"
        description="切换输入框类型，观察同一布尔状态如何同时控制按钮文案和密码可见性。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="显式设置与函数更新"
        description="使用 setTrue、setFalse 与 setValue，重复启用不会反转状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
