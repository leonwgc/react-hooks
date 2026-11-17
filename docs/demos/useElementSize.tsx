import { useRef } from "react";
import { useElementSize } from "../../src";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  return (
    <div ref={ref} className="resize-pad">
      <p>拖动右下角调整容器大小</p>
      <output>
        {Math.round(size.width)} × {Math.round(size.height)} px
      </output>
    </div>
  );
}
