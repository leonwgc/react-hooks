import { Scenario } from "./Scenario";
import Case1 from "./useQuery/Case1";
import Case1Source from "./useQuery/Case1.tsx?raw";
import Case2 from "./useQuery/Case2";
import Case2Source from "./useQuery/Case2.tsx?raw";
import Enhanced1 from "./useQuery/Enhanced1";
import Enhanced1Source from "./useQuery/Enhanced1.tsx?raw";
import Enhanced2 from "./useQuery/Enhanced2";
import Enhanced2Source from "./useQuery/Enhanced2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="缓存键切换与复用"
        description="A、B 使用不同缓存项，再次切回 A 会复用新鲜数据；null 暂停订阅。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="手动查询与错误恢复"
        description="enabled 为 false 时不自动请求；失败后显式重试，并可取消正在进行的请求。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="结构键与分页保留"
        description="用数组和对象描述缓存键，切页时保留前页数据，并可按 articles 前缀刷新全部已有页。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="选择数据与隔离订阅"
        description="两个订阅者共用缓存，计数组件只订阅 count；修改备注不会重绘该组件。"
      >
        <Enhanced2 />
      </Scenario>
    </div>
  );
}
