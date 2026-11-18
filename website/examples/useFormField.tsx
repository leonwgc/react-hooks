import { Scenario } from "./Scenario";
import Case1 from "./useFormField/Case1";
import Case1Source from "./useFormField/Case1.tsx?raw";
import Case2 from "./useFormField/Case2";
import Case2Source from "./useFormField/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="自定义数值字段"
        description="直接使用 setValue 接入数字控件，失焦时触发该字段校验。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="嵌套路径与外部重置"
        description="订阅嵌套字段，父表单直接写入或重置后订阅者同步更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
