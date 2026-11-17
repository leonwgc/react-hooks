import { useClipboard } from "../../src";

export default function Demo() {
  const clipboard = useClipboard();
  return (
    <div className="demo-stack">
      <code>npm install git+https://github.com/leonwgc/react-hooks.git</code>
      <button
        onClick={() =>
          void clipboard.copy(
            "npm install git+https://github.com/leonwgc/react-hooks.git",
          )
        }
      >
        {clipboard.copied ? "已复制" : "复制安装命令"}
      </button>
      {clipboard.error !== undefined && (
        <p role="alert">复制失败，请手动选择文本复制。</p>
      )}
    </div>
  );
}
