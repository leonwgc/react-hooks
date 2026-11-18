import * as React from "react";

import { useWindowSize } from "../../../src";

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

export default Case1;
