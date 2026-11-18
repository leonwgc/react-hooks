import { Scenario } from "./Scenario";
import Case1 from "./useEventSource/Case1";
import Case1Source from "./useEventSource/Case1.tsx?raw";
import Case2 from "./useEventSource/Case2";
import Case2Source from "./useEventSource/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自定义事件与 JSON 解析"
        description="本地事件源模拟命名事件，发送正确或错误 JSON，观察解析结果与错误恢复。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="按需连接与重新连接"
        description="url 为 null 时不连接，启用后可以主动关闭和重连；事件源仅在本地运行。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
