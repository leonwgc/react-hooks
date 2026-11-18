import * as React from "react";

import { useDirty } from "../../../src";

function Case2() {
  const [value, setValue] = React.useState("Hello");
  const dirty = useDirty(value, {
    isEqual: (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase(),
  });
  return (
    <>
      <label>
        忽略空白的标题
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <button onClick={() => setValue(" HELLO ")}>仅改变格式</button>
      <button onClick={() => setValue("New title")}>改变内容</button>
      <output>{dirty.isDirty ? "内容变化" : "内容相同"}</output>
    </>
  );
}

export default Case2;
