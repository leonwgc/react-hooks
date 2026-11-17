import { useOnline } from "../../src";

export default function Demo() {
  const online = useOnline();
  return (
    <div className="demo-stack">
      <output className="status-chip">
        {online ? "● 浏览器在线" : "○ 浏览器离线"}
      </output>
      <p>可在开发者工具中切换 Offline。在线不代表服务器一定可达。</p>
    </div>
  );
}
