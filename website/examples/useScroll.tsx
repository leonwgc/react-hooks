import * as React from "react";
import { useScroll } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { x } = useScroll(ref);
  return (
    <>
      <button
        onClick={() => ref.current?.scrollBy({ left: 180, behavior: "smooth" })}
      >
        向右浏览
      </button>
      <button onClick={() => ref.current?.scrollTo({ left: 0 })}>
        回到左端
      </button>
      <div ref={ref} style={{ overflow: "auto", maxWidth: "100%" }}>
        <div style={{ width: 900, padding: 20 }}>
          栏目一　　栏目二　　栏目三　　栏目四
        </div>
      </div>
      <output>水平位置 {Math.round(x)}px</output>
    </>
  );
}
function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { y } = useScroll(ref);
  return (
    <>
      <div ref={ref} className="scroll-pad">
        <div style={{ height: 600 }}>长文章内容，向下滚动阅读。</div>
      </div>
      <progress
        aria-label="容器阅读进度"
        value={y}
        max={Math.max(
          1,
          (ref.current?.scrollHeight ?? 600) -
            (ref.current?.clientHeight ?? 180),
        )}
      />
      <button
        onClick={() => ref.current?.scrollTo({ top: 0, behavior: "smooth" })}
      >
        回到阅读顶部
      </button>
      <output>已阅读偏移 {Math.round(y)}px</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="横向滚动位置"
        description="横向容器使用 x 值；按钮和手动滚动共用同一真实滚动状态。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="阅读进度与回到顶部"
        description="依据容器 scrollHeight 计算阅读进度，滚动一段后显示返回按钮。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
