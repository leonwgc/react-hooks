import * as React from "react";

import { useImage } from "../../../src";

const svg = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="${color}"/></svg>`,
  )}`;
const sources = [svg("#4f7cff"), svg("#22a06b"), "/missing-image.png"];

function Feature1() {
  const [index, setIndex] = React.useState(0);
  const src = sources[index % sources.length]!;
  const image = useImage(src);
  const [history, setHistory] = React.useState<string[]>([]);
  const entry = `${(index % sources.length) + 1}:${image.status}`;
  React.useEffect(() => {
    setHistory((list) =>
      list.at(-1) === entry ? list : [...list, entry].slice(-6),
    );
  }, [entry]);
  return (
    <>
      <button onClick={() => setIndex((n) => n + 1)}>切换到下一张图片</button>
      <output>
        当前第 {(index % sources.length) + 1} 张 · {image.status} · 返回的 src
        {image.src === src ? "与请求一致" : "不一致"}
      </output>
      {image.status === "loaded" && <img src={image.src!} alt="当前图片" />}
      <p>最近状态（序号:状态）：{history.join(" → ")}</p>
    </>
  );
}

export default Feature1;
