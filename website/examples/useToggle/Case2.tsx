import * as React from "react";

import { useToggle } from "../../../src";

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

export default Case2;
