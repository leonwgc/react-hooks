import * as React from "react";

import { useImage } from "../../../src";

const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" fill="#16856b"/></svg>',
  );

function Case1() {
  const [enabled, setEnabled] = React.useState(false);
  const image = useImage(enabled ? picture : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停止并清空图片" : "加载演示图片"}
      </button>
      {image.src && image.status === "loaded" && (
        <img src={image.src} alt="绿色示例卡片" style={{ maxWidth: "100%" }} />
      )}
      <output>
        {image.status} · {image.width}×{image.height}
      </output>
    </>
  );
}

export default Case1;
