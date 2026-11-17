import { useRef } from "react";
import { useFullscreen } from "../../src";
export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const fullscreen = useFullscreen(ref);
  return (
    <div
      ref={ref}
      className="demo-stack"
      style={{ background: "var(--bg)", padding: 20 }}
    >
      <p>阅读与图表全屏区域</p>
      <button
        disabled={!fullscreen.supported}
        onClick={() => void fullscreen.toggle()}
      >
        {fullscreen.active ? "退出全屏" : "进入全屏"}
      </button>
      {!fullscreen.supported && <p>当前浏览器不支持全屏。</p>}
      {!!fullscreen.error && <p role="alert">{String(fullscreen.error)}</p>}
      <small>点击按钮触发；也可以按 Esc 退出。</small>
    </div>
  );
}
