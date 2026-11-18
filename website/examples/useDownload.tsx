import { Scenario } from "./Scenario";
import Case1 from "./useDownload/Case1";
import Case1Source from "./useDownload/Case1.tsx?raw";
import Case2 from "./useDownload/Case2";
import Case2Source from "./useDownload/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="本地生成 CSV 报表"
        description="修改数量后下载本地 CSV，演示数据不经过服务器。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="URL 下载与立即取消"
        description="使用本地 data URL 演示 fetch 路径；立即取消会阻止保存，无需请求外部服务器。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
