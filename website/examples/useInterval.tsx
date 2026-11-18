import { Scenario } from "./Scenario";
import Case1 from "./useInterval/Case1";
import Case1Source from "./useInterval/Case1.tsx?raw";
import Case2 from "./useInterval/Case2";
import Case2Source from "./useInterval/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="调整节奏与暂停"
        description="在运行时改变间隔，暂停后保留计数，恢复后按新间隔继续。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="启用时立即执行"
        description="immediate 为 true 时，启用定时器立即执行一次，然后按间隔运行。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
