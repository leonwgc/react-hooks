import * as React from "react";
import { useOnline } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const online = useOnline();
  const [draft, setDraft] = React.useState("");
  const [saved, setSaved] = React.useState("尚未提交");
  return (
    <>
      <label>
        离线草稿
        <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button disabled={!online} onClick={() => setSaved(draft || "空草稿")}>
        模拟提交草稿
      </button>
      <output>
        {online ? "允许提交" : "离线，草稿仍可编辑"} · {saved}
      </output>
    </>
  );
}
function Case2() {
  const online = useOnline();
  const [result, setResult] = React.useState("尚未读取");
  return (
    <>
      <button
        onClick={() =>
          setResult(
            online ? "在线分支：最新演示数据" : "离线分支：本地缓存数据",
          )
        }
      >
        按网络状态读取
      </button>
      <output>{result}</output>
      <p>切换 Offline 后再次读取，观察缓存分支。</p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="离线草稿与提交入口"
        description="输入始终可用，离线时保留草稿并禁用模拟提交；可用浏览器开发工具切换 Offline。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="缓存回退策略"
        description="点击读取时根据真实网络状态选择演示数据源，不发送外部请求。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
