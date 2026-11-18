var e=`import * as React from "react";
import { useTextSelection } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  return (
    <>
      <p ref={ref}>这段内容可被引用到笔记中。</p>
      <button
        onClick={() => {
          if (!ref.current) return;
          const range = document.createRange();
          range.selectNodeContents(ref.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }}
      >
        选中整段内容
      </button>
      <button onClick={s.clear}>取消段落选中</button>
      <output>{s.text || "无选区"}</output>
    </>
  );
}
function Case2() {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const s = useTextSelection(ref);
  const [quote, setQuote] = React.useState("尚未引用");
  return (
    <>
      <p ref={ref}>受跟踪段落：选中这里可以生成引用。</p>
      <p>外部段落：选中这里不会作为区域内选区返回。</p>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setQuote(s.text || "请先选中受跟踪文字")}
      >
        保存选中引用
      </button>
      <output>{quote}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="按钮创建段落选区"
        description="使用浏览器 Selection API 选中段落，Hook 读取真实选区，清除按钮移除选中。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="限制到指定区域"
        description="分别选中两个段落，只有受跟踪区域内的选区才会返回文本。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};