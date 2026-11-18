import { Scenario } from "./Scenario";
import Case1 from "./useKeyPress/Case1";
import Case1Source from "./useKeyPress/Case1.tsx?raw";
import Case2 from "./useKeyPress/Case2";
import Case2Source from "./useKeyPress/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="动态启用局部快捷键"
        description="聚焦区域按钮后按 Enter；暂停绑定时不触发。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="输入框中的多组合键"
        description="允许在输入框内使用 Alt+J / Alt+L，禁止默认动作并忽略长按重复。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
