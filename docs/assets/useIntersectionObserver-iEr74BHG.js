var e=`import * as React from "react";
import { useIntersectionObserver } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, {
    root,
    threshold: [0, 0.5, 1],
  });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 240, behavior: "smooth" })}>
        滚动到目标
      </button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 220 }}>向下滚动</div>
        <div ref={target} className="notice">
          观察目标
        </div>
        <div style={{ height: 120 }} />
      </div>
      <output>
        可见比例 {Math.round((entry?.intersectionRatio ?? 0) * 100)}%
      </output>
    </>
  );
}
function Case2() {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const target = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(target, { root, rootMargin: "100px" });
  return (
    <>
      <button onClick={() => root?.scrollTo({ top: 120 })}>
        滚动到预加载位置
      </button>
      <button onClick={() => root?.scrollTo({ top: 0 })}>回到容器顶部</button>
      <div ref={setRoot} className="scroll-pad">
        <div style={{ height: 320 }}>目标位于下面</div>
        <div ref={target}>待预加载内容</div>
      </div>
      <output>
        {entry?.isIntersecting ? "进入预加载范围" : "尚未进入范围"}
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="指定滚动根容器"
        description="目标只相对内部滚动容器计算可见比例，滚动或按钮定位均可触发。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="预加载边距"
        description="使用 100px rootMargin 提前感知目标，不代表目标已经实际进入可见区域。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};