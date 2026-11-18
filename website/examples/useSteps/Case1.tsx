import * as React from "react";

import { useSteps } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [allow, setAllow] = React.useState(false);
  const s = useSteps({
    count: 3,
    validate: async ({ signal }) => {
      await delay(signal, 700);
      return allow;
    },
  });
  return (
    <>
      <button onClick={() => setAllow((v) => !v)}>
        {allow ? "改为校验失败" : "改为校验通过"}
      </button>
      <button onClick={() => void s.next()}>校验后进入下一步</button>
      <button onClick={s.cancel}>取消步骤校验</button>
      <output>
        步骤 {s.step + 1} · {s.validating ? "校验中" : "等待操作"}
      </output>
    </>
  );
}

export default Case1;
