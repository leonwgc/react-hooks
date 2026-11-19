import { Scenario } from "./Scenario";
import Case1 from "./useAsyncQueue/Case1";
import Case1Source from "./useAsyncQueue/Case1.tsx?raw";
import Case2 from "./useAsyncQueue/Case2";
import Case2Source from "./useAsyncQueue/Case2.tsx?raw";
import Enhanced1 from "./useAsyncQueue/Enhanced1";
import Enhanced1Source from "./useAsyncQueue/Enhanced1.tsx?raw";
import Enhanced2 from "./useAsyncQueue/Enhanced2";
import Enhanced2Source from "./useAsyncQueue/Enhanced2.tsx?raw";
import Feature1 from "./useAsyncQueue/Feature1";
import Feature1Source from "./useAsyncQueue/Feature1.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="动态并发与运行计数"
        description="新增四个任务，改变并发上限后观察等待任务的调度；降低上限不终止已运行任务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="单任务失败不阻断后续"
        description="失败任务记录 error，后续任务继续运行，结束后可以清理历史。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="优先级与队列容量"
        description="暂停后加入普通和高优先级任务，恢复时高优先级先执行；超过容量会明确拒绝。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="失败重试与超时取消"
        description="前两次失败后成功；另一个任务超时后终止，不继续重试。可在退避等待中取消全部。"
      >
        <Enhanced2 />
      </Scenario>
      <Scenario
        source={Feature1Source}
        title="超时重试与迟到结果"
        description="开启 retryOnTimeout 后首次超时会自动重试；被超时的旧尝试稍后返回也会被忽略，已结束记录可单独移除。"
      >
        <Feature1 />
      </Scenario>
    </div>
  );
}
