import * as React from "react";
import { useLeaveConfirm } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [allow, setAllow] = React.useState(false);
  const [result, setResult] = React.useState("等待导航");
  const leave = useLeaveConfirm(true, { confirm: () => allow });
  return (
    <>
      <button onClick={() => setAllow((v) => !v)}>
        {allow ? "改为拒绝离开" : "改为允许离开"}
      </button>
      <button
        onClick={() =>
          void leave
            .guard(() => setResult("已执行导航"))
            .then((ok) => {
              if (!ok) setResult("已保留编辑");
            })
        }
      >
        尝试页内导航
      </button>
      <output>{result}</output>
    </>
  );
}
function Case2() {
  const [dirty, setDirty] = React.useState(false);
  const [result, setResult] = React.useState("尚未离开");
  const leave = useLeaveConfirm(dirty, {
    confirm: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return false;
    },
  });
  return (
    <>
      <button onClick={() => setDirty(true)}>产生修改</button>
      <button onClick={() => setDirty(false)}>保存修改</button>
      <button
        onClick={() =>
          void leave
            .confirmLeave()
            .then((ok) => setResult(ok ? "可以离开" : "需要先保存"))
        }
      >
        检查能否离开
      </button>
      <output>
        {dirty ? "未保存" : "已保存"} · {result}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="自定义确认与取消"
        description="以页内选择代替浏览器弹窗，分别体验允许离开和继续编辑。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="保存后无需确认"
        description="dirty 为 false 时跳过确认；修改后恢复保护，异步确认完成才执行导航。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
