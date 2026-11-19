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
import Feature3 from "./useForm/Feature3";
import Feature3Source from "./useForm/Feature3.tsx?raw";
import Feature4 from "./useForm/Feature4";
import Feature4Source from "./useForm/Feature4.tsx?raw";
import Feature5 from "./useForm/Feature5";
import Feature5Source from "./useForm/Feature5.tsx?raw";
import Feature6 from "./useForm/Feature6";
import Feature6Source from "./useForm/Feature6.tsx?raw";
import Feature7 from "./useForm/Feature7";
import Feature7Source from "./useForm/Feature7.tsx?raw";
import Feature8 from "./useForm/Feature8";
import Feature8Source from "./useForm/Feature8.tsx?raw";
import Feature9 from "./useForm/Feature9";
import Feature9Source from "./useForm/Feature9.tsx?raw";
import Feature10 from "./useForm/Feature10";
import Feature10Source from "./useForm/Feature10.tsx?raw";
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
      <Scenario
        source={Feature3Source}
        title="声明式规则与无障碍错误"
        description="register 直接声明 required、长度、pattern、min 与自定义 validate；criteriaMode: 'all' 列出全部失败规则，错误通过 aria-describedby 关联到输入框。"
      >
        <Feature3 />
      </Scenario>
      <Scenario
        source={Feature4Source}
        title="异步查重的中止与字段级 loading"
        description="连续输入会通过 signal 中止上一次查重；validatingFields 为每个字段单独显示校验中，两个字段可以同时校验。"
      >
        <Feature4 />
      </Scenario>
      <Scenario
        source={Feature5Source}
        title="异步加载编辑数据"
        description="loadValues 加载服务端数据作为基准，加载期间显示 isLoading；修改后 dirtyFields 精确列出改动字段，可重新加载。"
      >
        <Feature5 />
      </Scenario>
      <Scenario
        source={Feature6Source}
        title="外部数据刷新保留用户修改"
        description="values 变化时自动同步，keepDirtyValues 保留用户已改的字段，其余字段更新为服务端新值。"
      >
        <Feature6 />
      </Scenario>
      <Scenario
        source={Feature7Source}
        title="提交转换、失败回调与服务端错误"
        description="transform 在提交前整理数据，onInvalid 接收校验失败；服务端拒绝时用 setErrors 回填字段错误，并显示 submitCount 与 isSubmitSuccessful。"
      >
        <Feature7 />
      </Scenario>
      <Scenario
        source={Feature8Source}
        title="草稿自动保存与恢复"
        description="persist 防抖保存到 localStorage，关闭后重新打开会恢复草稿；密码字段被 exclude，发布成功后自动清除草稿。"
      >
        <Feature8 />
      </Scenario>
      <Scenario
        source={Feature9Source}
        title="Standard Schema 适配"
        description="standardSchema 接入 Zod、Valibot、ArkType 等实现 Standard Schema 的校验库；失焦时只采纳当前字段的错误。"
      >
        <Feature9 />
      </Scenario>
      <Scenario
        source={Feature10Source}
        title="按字段渲染与程序化赋值"
        description="字段通过 useFormField、预览通过 useWatch 订阅，修改字段时表单根组件不重渲染；shouldDirty: false 赋值后字段仍视为未修改。"
      >
        <Feature10 />
      </Scenario>
    </div>
  );
}
