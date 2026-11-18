import { CodeBlock } from "./CodeBlock";
import demoHelpersSource from "./demos/webHelpers.ts?raw";

/** Use the same module for the running example and its copyable source. */
export function DemoSource({
  source,
  basic = false,
}: {
  source: string;
  basic?: boolean;
}) {
  const code =
    source
      .replace(/(["'])(?:\.\.\/)+src\1/g, '"@leonwgc/react-hooks"')
      .replace(/import \{ delay \} from [^;]+;\n?/, "") +
    (source.includes("webHelpers")
      ? "\n// 可取消的本地延时\n" + demoHelpersSource
      : "");
  return (
    <details
      className={`demo-source ${basic ? "source-details" : "scenario-source-details"}`}
    >
      <summary>
        {basic ? "查看基础示例源码" : "查看此示例源码"}
        <span aria-hidden="true">TSX</span>
      </summary>
      <CodeBlock code={code} />
    </details>
  );
}
