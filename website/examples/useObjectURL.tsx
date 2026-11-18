import { Scenario } from "./Scenario";
import Case1 from "./useObjectURL/Case1";
import Case1Source from "./useObjectURL/Case1.tsx?raw";
import Case2 from "./useObjectURL/Case2";
import Case2Source from "./useObjectURL/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="选择本地图片预览"
        description="选择文件后生成对象 URL，不上传到外部服务；替换文件会释放旧地址。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="替换 Blob 与显式释放"
        description="生成不同文本 Blob，观察地址变化；传入 null 后地址立即消失。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
