import * as React from "react";
import { useDrop, useDrag } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [disabled, setDisabled] = React.useState(true);
  const [result, setResult] = React.useState("尚未接收");
  const drag = useDrag("待投放内容");
  const drop = useDrop(({ text }) => setResult(text), { disabled });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用接收" : "停用接收"}
      </button>
      <div {...drag.bind}>拖动待投放内容</div>
      <div {...drop.bind} className="notice">
        {disabled ? "接收已关闭" : drop.over ? "松开投放" : result}
      </div>
      <button disabled={disabled} onClick={() => setResult("待投放内容")}>
        键盘投放内容
      </button>
    </>
  );
}
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="禁用接收区域"
        description="禁用后不接受拖放；启用后拖入文字或使用按钮完成同一业务动作。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="文件元信息与业务校验"
        description="接收到文件后展示名称、大小和类型；此示例只接受小于 1MB 的文件，不上传。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
