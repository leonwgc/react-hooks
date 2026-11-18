import { Scenario } from "./Scenario";
import Case1 from "./useAsyncAction/Case1";
import Case1Source from "./useAsyncAction/Case1.tsx?raw";
import Case2 from "./useAsyncAction/Case2";
import Case2Source from "./useAsyncAction/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="错误后重新提交"
        description="第一次主动模拟失败，下一次传入成功参数，观察错误状态清空。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="并发调用共享结果"
        description="同一事件中连续调用两次，观察 Promise 引用相同且只执行一个任务。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
