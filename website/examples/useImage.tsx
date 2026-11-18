import * as React from "react";
import { useImage } from "../../src";
import { Scenario } from "./Scenario";
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" fill="#16856b"/></svg>',
  );
function Case1() {
  const [enabled, setEnabled] = React.useState(false);
  const image = useImage(enabled ? picture : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停止并清空图片" : "加载演示图片"}
      </button>
      {image.src && image.status === "loaded" && (
        <img src={image.src} alt="绿色示例卡片" style={{ maxWidth: "100%" }} />
      )}
      <output>
        {image.status} · {image.width}×{image.height}
      </output>
    </>
  );
}
function Case2() {
  const [broken, setBroken] = React.useState(true);
  const image = useImage(broken ? "data:image/png;base64,invalid" : picture);
  return (
    <>
      <button onClick={() => setBroken((v) => !v)}>
        {broken ? "切换正确图片" : "切换损坏图片"}
      </button>
      <output>加载状态 {image.status}</output>
      {image.status === "loaded" && image.src && (
        <img src={image.src} alt="恢复后的卡片" style={{ maxWidth: "100%" }} />
      )}
      {!!image.error && <p role="alert">图片加载失败，可切换地址重试。</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="按需启动图片加载"
        description="最初传入 null，点击后加载本地生成的 SVG，不访问外部图片服务。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="错误状态与切换恢复"
        description="不设置备用图时，损坏图片进入 error；切换正确地址后可恢复。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
