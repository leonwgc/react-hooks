import { Scenario } from "./Scenario";
import Case1 from "./useLatest/Case1";
import Case1Source from "./useLatest/Case1.tsx?raw";
import Case2 from "./useLatest/Case2";
import Case2Source from "./useLatest/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="长期订阅读取最新草稿"
        description="事件监听只安装一次，修改输入后触发事件仍能读到最新内容。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="引用更新不主动渲染"
        description="在事件中暂存 ref 值并读取；下一次渲染会再次同步传入值。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
