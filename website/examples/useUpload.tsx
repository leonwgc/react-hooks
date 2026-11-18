import { Scenario } from "./Scenario";
import Case1 from "./useUpload/Case1";
import Case1Source from "./useUpload/Case1.tsx?raw";
import Case2 from "./useUpload/Case2";
import Case2Source from "./useUpload/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="上传前校验与批量加入"
        description="在调用 add 前检查文件大小；按钮创建小型本地示例文件，传输完全在内存模拟。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="暂停排队与恢复传输"
        description="暂停只阻止新任务启动，正在进行的任务继续；可取消全部并清除已结束任务。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
