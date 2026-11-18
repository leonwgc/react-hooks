import * as React from "react";

import { useObjectURL } from "../../../src";

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

export default Case1;
