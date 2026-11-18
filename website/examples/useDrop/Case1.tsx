import * as React from "react";

import { useDrop, useDrag } from "../../../src";

function Case1() {
  const [disabled, setDisabled] = React.useState(true);
  const [result, setResult] = React.useState("尚未接收");
  const drag = useDrag("待投放内容");
  const drop = useDrop(({ text }) => setResult(text), { disabled });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用接收" : "停用接收"}
      </button>
      <div {...drag.bind}>拖动待投放内容</div>
      <div {...drop.bind} className="notice">
        {disabled ? "接收已关闭" : drop.over ? "松开投放" : result}
      </div>
      <button disabled={disabled} onClick={() => setResult("待投放内容")}>
        键盘投放内容
      </button>
    </>
  );
}

export default Case1;
