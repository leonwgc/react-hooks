import { useState } from "react";
import { useGesture } from "../../src";
export default function Demo() {
  const [page, setPage] = useState(1);
  const previous = () => setPage((n) => Math.max(1, n - 1));
  const next = () => setPage((n) => Math.min(5, n + 1));
  const gesture = useGesture({
    axis: "x",
    onEnd: (state) => {
      if (state.swipe === "left") next();
      if (state.swipe === "right") previous();
    },
  });
  return (
    <div className="demo-stack">
      <div {...gesture.bind} className="pointer-pad" aria-label="滑动翻页区域">
        按住横向拖动，向左滑动翻到下一页<output>第 {page} / 5 页</output>
      </div>
      <div className="demo-row">
        <button onClick={previous}>上一张</button>
        <button onClick={next}>下一张</button>
        <button onClick={gesture.reset}>重置手势状态</button>
      </div>
      <output>
        位移 {Math.round(gesture.offset.x)}px · 滑动 {gesture.swipe ?? "无"}
      </output>
    </div>
  );
}
