import { Scenario } from "./Scenario";
import Case1 from "./useImage/Case1";
import Case1Source from "./useImage/Case1.tsx?raw";
import Case2 from "./useImage/Case2";
import Case2Source from "./useImage/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="按需启动图片加载"
        description="最初传入 null，点击后加载本地生成的 SVG，不访问外部图片服务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="错误状态与切换恢复"
        description="不设置备用图时，损坏图片进入 error；切换正确地址后可恢复。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
