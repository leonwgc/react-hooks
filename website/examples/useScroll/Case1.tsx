import * as React from "react";

import { useScroll } from "../../../src";

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

export default Case1;
