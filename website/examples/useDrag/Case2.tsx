import * as React from "react";

import { useDrag, useDrop } from "../../../src";

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

export default Case2;
