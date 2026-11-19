import * as React from "react";

import { useDrag } from "../../../src";

function Feature1() {
  const [visible, setVisible] = React.useState(true);
  const drag = useDrag("临时卡片");
  return (
    <>
      <button onClick={() => setVisible(true)}>恢复拖拽源</button>
      {visible ? (
        <div
          className="notice"
          {...drag.bind}
          onDragStart={(event) => {
            drag.bind.onDragStart(event);
            // Simulate a list refresh removing the source while it is being dragged.
            setTimeout(() => setVisible(false), 300);
          }}
        >
          拖动我：300ms 后此卡片会被移除
        </div>
      ) : (
        <p>拖拽源已卸载，它的 dragend 不会再触发。</p>
      )}
      <output>dragging：{String(drag.dragging)}</output>
      <p>松开鼠标（drop）或下一次按下指针时，dragging 会自动复位为 false。</p>
    </>
  );
}

export default Feature1;
