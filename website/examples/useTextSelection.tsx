import { Scenario } from "./Scenario";
import Case1 from "./useTextSelection/Case1";
import Case1Source from "./useTextSelection/Case1.tsx?raw";
import Case2 from "./useTextSelection/Case2";
import Case2Source from "./useTextSelection/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="按钮创建段落选区"
        description="使用浏览器 Selection API 选中段落，Hook 读取真实选区，清除按钮移除选中。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="限制到指定区域"
        description="分别选中两个段落，只有受跟踪区域内的选区才会返回文本。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
