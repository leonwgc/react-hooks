import { Scenario } from "./Scenario";
import Case1 from "./useForm/Case1";
import Case1Source from "./useForm/Case1.tsx?raw";
import Case2 from "./useForm/Case2";
import Case2Source from "./useForm/Case2.tsx?raw";
import Enhanced1 from "./useForm/Enhanced1";
import Enhanced1Source from "./useForm/Enhanced1.tsx?raw";
import Enhanced2 from "./useForm/Enhanced2";
import Enhanced2Source from "./useForm/Enhanced2.tsx?raw";
import Feature1 from "./useForm/Feature1";
import Feature1Source from "./useForm/Feature1.tsx?raw";
import Feature2 from "./useForm/Feature2";
import Feature2Source from "./useForm/Feature2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="嵌套字段与局部校验"
        description="通过点号路径注册嵌套值，只校验指定字段，并显示 touched 与错误。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="提交失败与服务端字段错误"
        description="模拟提交失败后展示 submitError，也可把业务错误绑定到字段；重置会清理状态。"
      >
        <Case2 />
      </Scenario>
      <Scenario
        source={Enhanced1Source}
        title="单字段重置与错误聚焦"
        description="提交空值时自动聚焦首个错误字段；只重置姓名，不影响另一字段的编辑。"
      >
        <Enhanced1 />
      </Scenario>
      <Scenario
        source={Enhanced2Source}
        title="条件字段卸载策略"
        description="勾选移除策略后，隐藏字段会注销其值与校验；默认隐藏后仍保留。"
      >
        <Enhanced2 />
      </Scenario>
      <Scenario
        source={Feature1Source}
        title="单选组、复选框组、多选与文件"
        description="register 传入 value 绑定 radio 与复选框组，数组字段配合 select multiple，type: 'file' 时值为 File[]。"
      >
        <Feature1 />
      </Scenario>
      <Scenario
        source={Feature2Source}
        title="失焦只校验当前字段"
        description="onBlur 模式下离开姓名只显示姓名错误，未交互的邮箱不会提前报错。"
      >
        <Feature2 />
      </Scenario>
    </div>
  );
}
