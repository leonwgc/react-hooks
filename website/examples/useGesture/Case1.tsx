import { useGesture } from "../../../src";

function Case1() {
  const g = useGesture({ axis: "y", threshold: 6 });
  return (
    <>
      <div {...g.bind} className="pointer-pad" aria-label="垂直手势区域">
        在区域内上下拖动
      </div>
      <button onClick={g.cancel}>取消当前拖动</button>
      <button onClick={g.reset}>清零手势位移</button>
      <output>
        X {Math.round(g.offset.x)} / Y {Math.round(g.offset.y)} ·{" "}
        {g.dragging ? "拖动中" : "未拖动"}
      </output>
    </>
  );
}

export default Case1;
