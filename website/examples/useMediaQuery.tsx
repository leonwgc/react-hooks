import { Scenario } from "./Scenario";
import Case1 from "./useMediaQuery/Case1";
import Case1Source from "./useMediaQuery/Case1.tsx?raw";
import Case2 from "./useMediaQuery/Case2";
import Case2Source from "./useMediaQuery/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="动态响应式断点"
        description="修改断点输入，媒体查询随配置变化重新订阅。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="切换设备能力查询"
        description="选择悬停能力、精细指针或系统深色模式，读取真实浏览器状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
