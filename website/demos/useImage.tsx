import { useState } from "react";
import { useImage } from "../../src";
const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120"><rect width="320" height="120" fill="#2b5cff"/><text x="100" y="68" fill="white" font-size="22">Web Hooks</text></svg>',
  );
export default function Demo() {
  const [broken, setBroken] = useState(false);
  const image = useImage(broken ? "data:image/png;base64,broken" : picture, {
    fallback: picture,
  });
  return (
    <div className="demo-stack">
      <label className="check">
        <input
          type="checkbox"
          checked={broken}
          onChange={(e) => setBroken(e.target.checked)}
        />
        模拟原图损坏，使用备用图
      </label>
      {image.status === "loaded" && image.src && (
        <img
          src={image.src}
          alt="Web Hooks 蓝色示例图"
          width={320}
          height={120}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <output>
        {image.status} · {image.width} × {image.height}
      </output>
    </div>
  );
}
