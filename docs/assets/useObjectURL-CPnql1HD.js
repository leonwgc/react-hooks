var e=`import * as React from "react";
import { useObjectURL } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [file, setFile] = React.useState<File | null>(null);
  const value = useObjectURL(file);
  return (
    <>
      <label>
        预览图片
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {value.url && (
        <img
          src={value.url}
          alt="本地选择的预览图片"
          style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain" }}
        />
      )}
      <button onClick={() => setFile(null)}>移除文件预览</button>
      <output>{file?.name ?? "未选择文件"}</output>
    </>
  );
}
function Case2() {
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [count, setCount] = React.useState(0);
  const value = useObjectURL(blob);
  return (
    <>
      <button
        onClick={() => {
          setCount((n) => n + 1);
          setBlob(new Blob([\`版本 \${count + 1}\`], { type: "text/plain" }));
        }}
      >
        生成下一版文本 Blob
      </button>
      <button onClick={() => setBlob(null)}>清空对象 URL</button>
      <output>{value.url ?? "URL 已释放"}</output>
      {!!value.error && <p role="alert">{String(value.error)}</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="选择本地图片预览"
        description="选择文件后生成对象 URL，不上传到外部服务；替换文件会释放旧地址。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="替换 Blob 与显式释放"
        description="生成不同文本 Blob，观察地址变化；传入 null 后地址立即消失。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};