import * as React from "react";

import { useDrop } from "../../../src";

function Case2() {
  const [result, setResult] = React.useState("未选择");
  const accept = (files: File[]) =>
    setResult(
      files
        .map(
          (f) =>
            `${f.name} · ${f.size} 字节 · ${f.type || "未知类型"} · ${f.size <= 1024 * 1024 ? "接受" : "超过 1MB"}`,
        )
        .join("；"),
    );
  const drop = useDrop(({ files }) => accept(files));
  return (
    <>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开以检查文件" : "拖入文件检查元信息"}
        <label>
          选择待检查文件
          <input
            type="file"
            multiple
            onChange={(e) => accept(Array.from(e.target.files ?? []))}
          />
        </label>
      </div>
      <output>{result}</output>
    </>
  );
}

export default Case2;
