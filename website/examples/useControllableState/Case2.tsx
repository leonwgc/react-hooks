import * as React from "react";

import { useControllableState } from "../../../src";

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

export default Case2;
