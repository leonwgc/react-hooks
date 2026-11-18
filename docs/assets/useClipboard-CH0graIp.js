var e=`import * as React from "react";
import { useClipboard } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [text, setText] = React.useState("可编辑的分享内容");
  const c = useClipboard();
  return (
    <>
      <label>
        待复制文本
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button onClick={() => void c.copy(text)}>复制当前文本</button>
      <output>{c.copied ? "复制成功" : "尚未复制"}</output>
      {!!c.error && <p role="alert">复制失败，请手动选择文本。</p>}
    </>
  );
}
function Case2() {
  const [count, setCount] = React.useState(1);
  const c = useClipboard();
  const text = JSON.stringify({ product: "Hooks", quantity: count }, null, 2);
  return (
    <>
      <button onClick={() => setCount((n) => n + 1)}>增加数量</button>
      <pre>{text}</pre>
      <button onClick={() => void c.copy(text)}>复制 JSON</button>
      <output>{c.copied ? "JSON 已复制" : "等待复制 JSON"}</output>
      {!!c.error && <p role="alert">当前环境无法复制，请选择上方 JSON。</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="复制用户编辑的文本"
        description="复制当前输入，失败时保留文本供手动选择。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="复制结构化数据"
        description="先序列化业务对象，再复制可读的 JSON 文本。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};