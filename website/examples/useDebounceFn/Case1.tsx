import * as React from "react";

import { useDebounceFn } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("");
  const [saved, setSaved] = React.useState("未保存");
  const save = useDebounceFn(
    (value: string) => setSaved(value || "空草稿"),
    600,
  );
  return (
    <>
      <label>
        自动保存草稿
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            save.run(e.target.value);
          }}
        />
      </label>
      <button onClick={() => save.flush()}>立即保存草稿</button>
      <button onClick={save.cancel}>取消待保存</button>
      <output>已保存：{saved}</output>
    </>
  );
}

export default Case1;
