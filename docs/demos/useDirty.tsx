import { useState } from "react";
import { useDirty } from "../../src";

export default function Demo() {
  const [value, setValue] = useState("我的文章");
  const dirty = useDirty(value);
  return (
    <div className="demo-stack">
      <label>
        文章标题
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <div className="demo-row">
        <button onClick={() => dirty.reset()}>标记为已保存</button>
        <output>{dirty.isDirty ? "有未保存的修改" : "所有修改已保存"}</output>
      </div>
    </div>
  );
}
