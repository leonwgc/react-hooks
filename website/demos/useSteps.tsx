import { useState } from "react";
import { useSteps } from "../../src";
export default function Demo() {
  const [name, setName] = useState("");
  const steps = useSteps({
    count: 3,
    validate: ({ from }) => from !== 0 || name.trim().length > 0,
  });
  return (
    <div className="demo-stack">
      <output>
        当前步骤 {steps.step + 1} / {steps.count}
      </output>
      {steps.step === 0 ? (
        <label>
          步骤姓名
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="填写后才能前进"
          />
        </label>
      ) : (
        <p>{steps.step === 1 ? `确认姓名：${name}` : "流程已完成"}</p>
      )}
      <div className="demo-row">
        <button disabled={steps.isFirst} onClick={() => void steps.previous()}>
          上一步
        </button>
        <button disabled={steps.isLast} onClick={() => void steps.next()}>
          下一步
        </button>
        <button onClick={() => steps.reset()}>重置步骤</button>
      </div>
      <small>已完成索引：{steps.completed.join(", ") || "无"}</small>
    </div>
  );
}
