import { Scenario } from "./Scenario";
import Case1 from "./useOnline/Case1";
import Case1Source from "./useOnline/Case1.tsx?raw";
import Case2 from "./useOnline/Case2";
import Case2Source from "./useOnline/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="离线草稿与提交入口"
        description="输入始终可用，离线时保留草稿并禁用模拟提交；可用浏览器开发工具切换 Offline。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="缓存回退策略"
        description="点击读取时根据真实网络状态选择演示数据源，不发送外部请求。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
