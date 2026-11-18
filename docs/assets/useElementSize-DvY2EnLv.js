var e=`import * as React from "react";
import { useElementSize } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(70);
  const size = useElementSize(ref);
  return (
    <>
      <label>
        容器宽度百分比
        <input
          type="range"
          min={30}
          max={100}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div
        ref={ref}
        className="notice"
        style={{ width: width + "%", boxSizing: "border-box" }}
      >
        尺寸观察区域
      </div>
      <output>
        {Math.round(size.width)} × {Math.round(size.height)} px
      </output>
    </>
  );
}
function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rows, setRows] = React.useState(1);
  const size = useElementSize(ref);
  return (
    <>
      <button onClick={() => setRows((n) => (n === 4 ? 1 : n + 1))}>
        增加段落或重置
      </button>
      <div ref={ref}>
        {Array.from({ length: rows }, (_, i) => (
          <p key={i}>第 {i + 1} 段动态内容</p>
        ))}
      </div>
      <output>内容高度 {Math.round(size.height)}px</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="通过控件改变容器宽度"
        description="滑块修改容器 CSS 宽度，观察 ResizeObserver 发布的实际尺寸。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="内容驱动高度变化"
        description="添加和移除段落，观察同一元素高度变化，无需监听窗口 resize。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};