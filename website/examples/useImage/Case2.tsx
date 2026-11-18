import * as React from "react";

import { useImage } from "../../../src";

const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" fill="#16856b"/></svg>',
  );

function Case2() {
  const [broken, setBroken] = React.useState(true);
  const image = useImage(broken ? "data:image/png;base64,invalid" : picture);
  return (
    <>
      <button onClick={() => setBroken((v) => !v)}>
        {broken ? "切换正确图片" : "切换损坏图片"}
      </button>
      <output>加载状态 {image.status}</output>
      {image.status === "loaded" && image.src && (
        <img src={image.src} alt="恢复后的卡片" style={{ maxWidth: "100%" }} />
      )}
      {!!image.error && <p role="alert">图片加载失败，可切换地址重试。</p>}
    </>
  );
}

export default Case2;
