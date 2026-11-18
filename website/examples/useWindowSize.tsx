import * as React from "react";
import { useWindowSize } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const size = useWindowSize();
  const [card, setCard] = React.useState(240);
  return (
    <>
      <label>
        卡片最小宽度
        <input
          type="range"
          min={120}
          max={500}
          value={card}
          onChange={(e) => setCard(Number(e.target.value))}
        />
      </label>
      <output>
        窗口 {size.width}px / 卡片 {card}px →{" "}
        {Math.max(1, Math.floor(size.width / card))} 列
      </output>
    </>
  );
}
function Case2() {
  const size = useWindowSize();
  const [snapshot, setSnapshot] = React.useState("未记录");
  return (
    <>
      <button onClick={() => setSnapshot(`${size.width} × ${size.height}`)}>
        记录视口快照
      </button>
      <output>
        实时 {size.width} × {size.height} ·{" "}
        {size.width >= size.height ? "横向" : "纵向"}
      </output>
      <output>快照：{snapshot}</output>
      <p>调整浏览器窗口大小即可观察差异。</p>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="按可用宽度计算列数"
        description="改变卡片最小宽度，结合真实窗口宽度计算建议列数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="视口比例与尺寸快照"
        description="记录当前视口后调整窗口，比较实时值与操作时的快照。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
