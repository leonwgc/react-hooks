var e=`import * as React from "react";
import { useThrottleFn } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [value, setValue] = React.useState(0);
  const [processed, setProcessed] = React.useState(0);
  const action = useThrottleFn((n: number) => setProcessed(n), 500);
  return (
    <>
      <label>
        拖动预览值
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            setValue(n);
            action.run(n);
          }}
        />
      </label>
      <output>
        即时 {value} · 已处理 {processed}
      </output>
      <button onClick={() => action.flush()}>立即同步尾沿</button>
    </>
  );
}
function Case2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const action = useThrottleFn(
    (value: string) => setEvents((s) => [...s, value]),
    1000,
  );
  return (
    <>
      <button
        onClick={() => {
          action.run("首条");
          action.run("尾条");
        }}
      >
        连续提交两条
      </button>
      <button onClick={action.cancel}>取消尾条</button>
      <button onClick={() => action.run("新窗口")}>提交新窗口</button>
      <output>{events.join(" → ") || "尚未执行"}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="拖动数值预览"
        description="滑块立即更新，节流处理值最多按固定间隔发布，并保留最后的数值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="取消与重新开始"
        description="连续提交会保留尾沿；cancel 清除尾沿并重置执行窗口。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};