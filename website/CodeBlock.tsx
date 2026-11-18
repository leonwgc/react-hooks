import { useState } from "react";
import { SyntaxCode } from "./SyntaxCode";

export function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="code-block">
      <button
        className="copy-button"
        onClick={() => {
          void navigator.clipboard
            ?.writeText(code)
            .then(() => {
              setCopied(true);
              setFailed(false);
            })
            .catch(() => setFailed(true));
          if (!navigator.clipboard) setFailed(true);
        }}
      >
        {failed ? "请手动复制" : copied ? "已复制 ✓" : "复制代码"}
      </button>
      <pre tabIndex={0}>
        <SyntaxCode code={code} language={language} />
      </pre>
    </div>
  );
}
