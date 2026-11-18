import * as React from "react";
import { useMediaQuery } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [width, setWidth] = React.useState(800);
  const matches = useMediaQuery(`(min-width: ${width}px)`);
  return (
    <>
      <label>
        断点宽度
        <input
          type="range"
          min={300}
          max={1600}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <output>
        窗口 ≥ {width}px：{matches ? "匹配" : "不匹配"}
      </output>
    </>
  );
}
function Case2() {
  const [query, setQuery] = React.useState("(hover: hover)");
  const matches = useMediaQuery(query);
  return (
    <>
      <label>
        媒体能力
        <select value={query} onChange={(e) => setQuery(e.target.value)}>
          <option>(hover: hover)</option>
          <option>(pointer: fine)</option>
          <option>(prefers-color-scheme: dark)</option>
        </select>
      </label>
      <output>
        {query}：{matches ? "支持 / 匹配" : "不匹配"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="动态响应式断点"
        description="修改断点输入，媒体查询随配置变化重新订阅。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="切换设备能力查询"
        description="选择悬停能力、精细指针或系统深色模式，读取真实浏览器状态。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
