import { Scenario } from "./Scenario";
import Case1 from "./useTable/Case1";
import Case1Source from "./useTable/Case1.tsx?raw";
import Case2 from "./useTable/Case2";
import Case2Source from "./useTable/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="适配不同服务响应"
        description="select 把 records/count 转为 list/total；分页变化会重新调用本地模拟服务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="请求失败与刷新恢复"
        description="演示服务失败后保留页面控制，关闭失败模拟后 refresh 重新获取当前查询。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
