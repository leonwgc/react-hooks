var e=`import * as React from "react";
import { useLongPress } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [disabled, setDisabled] = React.useState(false);
  const [delay, setDelay] = React.useState(300);
  const [count, setCount] = React.useState(0);
  const act = () => setCount((n) => n + 1);
  const p = useLongPress(act, { delay, disabled });
  return (
    <>
      <label>
        长按毫秒
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        >
          <option>300</option>
          <option>1000</option>
        </select>
      </label>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用长按" : "禁用长按"}
      </button>
      <button {...p.bind} disabled={disabled}>
        按住执行
      </button>
      <button disabled={disabled} onClick={act}>
        键盘执行一次
      </button>
      <output>执行 {count} 次</output>
    </>
  );
}
function Case2() {
  const [count, setCount] = React.useState(0);
  const p = useLongPress(() => setCount((n) => n + 1), {
    delay: 900,
    threshold: 4,
  });
  return (
    <>
      <button {...p.bind} style={{ touchAction: "none" }}>
        按住此处，移动后取消
      </button>
      <button onClick={p.cancel}>取消长按等待</button>
      <button onClick={() => setCount((n) => n + 1)}>键盘等价触发</button>
      <output>
        {p.pressing ? "识别中" : "未按住"} · {count} 次
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自定义时长与禁用"
        description="改变识别时长或禁用长按；键盘按钮调用同一个业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="移动阈值与主动取消"
        description="按住后移动超过 4px 会取消；取消按钮也可结束等待。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};