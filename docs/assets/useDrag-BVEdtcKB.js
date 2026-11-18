var e=`import * as React from "react";
import { useDrag, useDrop } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [result, setResult] = React.useState("等待卡片");
  const payload = JSON.stringify({ id: 7, title: "任务卡片" });
  const drag = useDrag(payload, {
    type: "application/x-hook-card",
    effectAllowed: "copy",
  });
  const accept = (text: string) => {
    try {
      const value: unknown = JSON.parse(text);
      setResult(JSON.stringify(value));
    } catch {
      setResult("数据格式错误");
    }
  };
  const drop = useDrop(({ text }) => accept(text), {
    type: "application/x-hook-card",
    dropEffect: "copy",
  });
  return (
    <>
      <div {...drag.bind} className="notice">
        拖动 JSON 卡片
      </div>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开以接收" : result}
      </div>
      <button onClick={() => accept(payload)}>键盘发送 JSON 卡片</button>
    </>
  );
}
function Case2() {
  const [disabled, setDisabled] = React.useState(true);
  const [result, setResult] = React.useState("无");
  const drag = useDrag("受控卡片", { disabled });
  const drop = useDrop(({ text }) => setResult(text));
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "允许拖动" : "锁定拖动"}
      </button>
      <div {...drag.bind} className="notice">
        {disabled ? "卡片已锁定" : "可拖动卡片"}
      </div>
      <div {...drop.bind} className="notice">
        接收：{result}
      </div>
      <button disabled={disabled} onClick={() => setResult("受控卡片")}>
        键盘移动卡片
      </button>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自定义 MIME 数据"
        description="拖放双方约定同一个数据类型，传递 JSON 文本并解析；按钮提供等价业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="只读时禁用拖动"
        description="切换 disabled 后 draggable 状态变化，目标区域继续支持正常接收。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};