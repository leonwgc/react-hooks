import { Scenario } from "./Scenario";
import Case1 from "./useRequest/Case1";
import Case1Source from "./useRequest/Case1.tsx?raw";
import Case2 from "./useRequest/Case2";
import Case2Source from "./useRequest/Case2.tsx?raw";
import Enhanced1 from "./useRequest/Enhanced1";
import Enhanced1Source from "./useRequest/Enhanced1.tsx?raw";
import Enhanced2 from "./useRequest/Enhanced2";
import Enhanced2Source from "./useRequest/Enhanced2.tsx?raw";
import Feature1 from "./useRequest/Feature1";
import Feature1Source from "./useRequest/Feature1.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自动请求与轮询控制"
        description="展开时按默认参数请求，启动轮询后定期刷新，停止会取消本轮并暂停后续轮询。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="竞争请求与本地修改"
        description="慢请求和快请求连续发出时只保留最新结果，mutate 可直接更新当前展示数据。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="就绪条件与依赖刷新"
        description="启用查询后自动加载；切换页码通过 refreshDeps 请求，关闭就绪条件会取消当前请求。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="延迟加载与生命周期"
        description="快请求不闪烁 loading；慢请求延迟显示加载，取消不触发 onFinally。"
      >
        <Enhanced2 />
      </Scenario>
      <Scenario
        source={Feature1Source}
        title="本地修改中止旧请求"
        description="慢请求进行中调用 mutate 会中止该请求，旧响应不会覆盖本地修改。"
      >
        <Feature1 />
      </Scenario>
    </div>
  );
}
