var e=`import * as React from "react";
import { useSteps } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
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
function Case2() {
  const [count, setCount] = React.useState(5);
  const s = useSteps({ count });
  return (
    <>
      <button onClick={() => void s.goTo(4)}>跳到第五步</button>
      <button onClick={() => setCount(2)}>缩减为两步</button>
      <button onClick={() => s.reset()}>回到流程起点</button>
      <output>
        步骤 {s.step + 1} / {s.count} · 完成 {s.completed.join(",") || "无"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="异步校验与取消"
        description="等待模拟校验时可取消；取消后即使旧服务结束，也不会跳到下一步。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="步骤数量与跳转边界"
        description="指定索引跳转，减少总步骤数后当前索引会限制到有效范围。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};