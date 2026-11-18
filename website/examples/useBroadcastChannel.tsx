import { Scenario } from "./Scenario";
import Case1 from "./useBroadcastChannel/Case1";
import Case1Source from "./useBroadcastChannel/Case1.tsx?raw";
import Case2 from "./useBroadcastChannel/Case2";
import Case2Source from "./useBroadcastChannel/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="结构化消息与解析"
        description="双连接演示对象消息，接收时验证字段后显示业务内容。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="不同频道互相隔离"
        description="发送方和接收方可使用不同频道，切换到同频道后再次发送才会收到。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
