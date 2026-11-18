import * as React from "react";

import { useForm } from "../../../src";

function Enhanced2() {
  const [shown, setShown] = React.useState(true),
    [remove, setRemove] = React.useState(false);
  const f = useForm<{ extra?: string }>({
    initialValues: { extra: "附加内容" },
    shouldUnregister: remove,
    validators: { extra: (v) => (v ? undefined : "附加内容必填") },
  });
  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={remove}
          onChange={(e) => setRemove(e.target.checked)}
        />
        卸载时移除字段
      </label>
      <button onClick={() => setShown((x) => !x)}>切换附加字段</button>
      {shown && (
        <label>
          附加内容
          <input {...f.register("extra")} />
        </label>
      )}
      <button onClick={() => void f.validate()}>校验条件字段</button>
      <output>
        值 {JSON.stringify(f.values)} · 错误 {JSON.stringify(f.errors)}
      </output>
    </>
  );
}

export default Enhanced2;
