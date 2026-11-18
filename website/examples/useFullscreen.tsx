import * as React from "react";
import { useFullscreen } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p>数据展示面板</p>
      <button disabled={!f.supported} onClick={() => void f.enter()}>
        全屏显示面板
      </button>
      <button onClick={() => void f.exit()}>退出面板全屏</button>
      <output>
        {f.active ? "面板全屏中" : f.supported ? "普通模式" : "浏览器不支持"}
      </output>
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}
function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p style={{ fontSize: f.active ? 24 : 14 }}>
        专注阅读：全屏只改变显示方式，不改变文章数据。
      </p>
      <button disabled={!f.supported} onClick={() => void f.toggle()}>
        {f.active ? "结束专注阅读" : "开始专注阅读"}
      </button>
      {!f.supported && <p>当前环境不支持全屏。</p>}
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="显式进入与退出"
        description="把内容面板设为全屏目标，独立调用 enter 与 exit，并展示错误。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="阅读时切换字号"
        description="全屏状态控制内容字号，退出后恢复普通阅读样式。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
