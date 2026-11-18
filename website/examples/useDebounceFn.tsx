import { Scenario } from "./Scenario";
import Case1 from "./useDebounceFn/Case1";
import Case1Source from "./useDebounceFn/Case1.tsx?raw";
import Case2 from "./useDebounceFn/Case2";
import Case2Source from "./useDebounceFn/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="草稿自动保存"
        description="输入持续重启等待，手动保存调用 flush，撤销待保存调用 cancel。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="只保留最后一组参数"
        description="依次传入 A、B、C；等待结束或立即执行只会处理最后一次参数。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
