import * as React from "react";

import { useLongPress } from "../../../src";

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

export default Case1;
