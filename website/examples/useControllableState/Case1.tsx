import * as React from "react";

import { useControllableState } from "../../../src";

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

export default Case1;
