import { Scenario } from "./Scenario";
import Case1 from "./useToggle/Case1";
import Case1Source from "./useToggle/Case1.tsx?raw";
import Case2 from "./useToggle/Case2";
import Case2Source from "./useToggle/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="数字缩放档位"
        description="在 100% 和 150% 两个数字值之间切换，也可以直接指定一个档位。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="对象预设与自定义值"
        description="对象按引用比较；手动设置第三个值后再次切换会回到第一个预设。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
