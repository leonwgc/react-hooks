import { Scenario } from "./Scenario";
import Case1 from "./useEventListener/Case1";
import Case1Source from "./useEventListener/Case1.tsx?raw";
import Case2 from "./useEventListener/Case2";
import Case2Source from "./useEventListener/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="动态启停元素监听"
        description="传入 null 暂停绑定，恢复后继续监听按钮的原生 click。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="捕获与冒泡顺序"
        description="父元素捕获监听与子元素原生监听共同记录事件传播顺序。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
