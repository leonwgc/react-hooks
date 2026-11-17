import { useMediaQuery } from "../../src";

export default function Demo() {
  const wide = useMediaQuery("(min-width: 768px)");
  return (
    <div className="demo-stack">
      <output className="large-value">{wide ? "桌面布局" : "移动布局"}</output>
      <p>调整浏览器宽度，观察 768px 断点。</p>
    </div>
  );
}
