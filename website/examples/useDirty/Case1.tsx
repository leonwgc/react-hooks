import * as React from "react";

import { useDirty } from "../../../src";

function Case1() {
  const [value, setValue] = React.useState({ profile: { name: "小林" } });
  const dirty = useDirty(value);
  return (
    <>
      <label>
        资料姓名
        <input
          value={value.profile.name}
          onChange={(e) => setValue({ profile: { name: e.target.value } })}
        />
      </label>
      <button onClick={() => setValue({ profile: { name: "小林" } })}>
        恢复原始内容
      </button>
      <button onClick={() => dirty.reset()}>保存资料基准</button>
      <output>{dirty.isDirty ? "资料已修改" : "资料未修改"}</output>
    </>
  );
}

export default Case1;
