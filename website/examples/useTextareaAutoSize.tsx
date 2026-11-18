import * as React from "react";
import { useTextareaAutoSize } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("");
  const [max, setMax] = React.useState(3);
  const size = useTextareaAutoSize(ref, text, { minRows: 1, maxRows: max });
  return (
    <>
      <label>
        最多显示行数
        <select value={max} onChange={(e) => setMax(Number(e.target.value))}>
          <option>3</option>
          <option>6</option>
        </select>
      </label>
      <label>
        行数限制文本
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 0, lineHeight: "22px", resize: "none" }}
        />
      </label>
      <button
        onClick={() =>
          setText(`一行
二行
三行
四行
五行`)
        }
      >
        填入五行
      </button>
      <button onClick={() => setText("")}>清空多行文本</button>
      <output>高度 {Math.round(size.height)}px</output>
    </>
  );
}
function Case2() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("可以调整的文本域");
  const [enabled, setEnabled] = React.useState(true);
  const size = useTextareaAutoSize(ref, text, { enabled, minRows: 2 });
  return (
    <>
      <label>
        可暂停自增高
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ height: 100, minHeight: 0, lineHeight: "22px" }}
        />
      </label>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用自增高" : "启用自增高"}
      </button>
      <button onClick={size.resize}>手动测量文本域</button>
      <output>
        {enabled ? "自动模式" : "原始 100px 高度"} · {Math.round(size.height)}px
      </output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="行数上限与内容收缩"
        description="输入或填入长内容，观察最大行数限制；清空后恢复最少行数。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="禁用与手动重新测量"
        description="关闭后恢复原内联高度，启用后重新测量；手动 resize 可用于外部字体和样式变化。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
