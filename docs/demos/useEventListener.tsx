import { useRef, useState } from "react";
import { useEventListener } from "../../src";

export default function Demo() {
  const target = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState("在区域内移动指针");
  useEventListener<PointerEvent>(
    "pointermove",
    (event) =>
      setPosition(
        `X: ${Math.round(event.offsetX)} · Y: ${Math.round(event.offsetY)}`,
      ),
    target,
  );
  return (
    <div ref={target} className="pointer-pad">
      <span>POINTER POSITION</span>
      <output>{position}</output>
    </div>
  );
}
