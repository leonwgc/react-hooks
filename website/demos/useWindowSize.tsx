import { useWindowSize } from "../../src";

export default function Demo() {
  const { width, height } = useWindowSize();
  return (
    <div className="demo-stack">
      <output className="large-value">
        {width} × {height}
      </output>
      <p>窗口尺寸随浏览器缩放更新，单位 px。</p>
    </div>
  );
}
