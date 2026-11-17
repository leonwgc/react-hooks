import { useMemo, type ComponentProps, type ReactNode } from "react";

// Same token categories as Atelier UI; React text nodes preserve source verbatim.
// See SOURCE.md for the reference snapshot and implementation differences.
const tsxRules = [
  ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
  [
    "string",
    /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`/,
  ],
  ["tag", /<\/?[A-Za-z][\w.]*/],
  [
    "keyword",
    /\b(?:import|from|export|default|const|let|var|function|return|async|await|type|interface|new|true|false|null|undefined|if|else|throw|try|catch|finally|extends|typeof|void|as|in|of)\b/,
  ],
  ["number", /\b\d+(?:\.\d+)?\b/],
  ["function", /\b[A-Za-z_$][\w$]*(?=\s*\()/],
  ["punctuation", /[{}()[\].,;:=<>!?|&+*/-]/],
] as const;
const shellRules = [
  ["comment", /#[^\n]*/],
  ["string", /"(?:\\.|[^"\\])*"|'[^']*'/],
  ["keyword", /\b(?:npm|npx|git|cd|node)\b/],
  ["punctuation", /[|&;]/],
] as const;

function highlight(source: string, language: string): ReactNode {
  const rules = ["tsx", "ts", "typescript", "jsx", "js", "javascript"].includes(
    language,
  )
    ? tsxRules
    : ["bash", "sh", "shell"].includes(language)
      ? shellRules
      : null;
  if (!rules) return source;
  const pattern = new RegExp(
    rules
      .map(([kind, expression]) => `(?<${kind}>${expression.source})`)
      .join("|"),
    "g",
  );
  const result: ReactNode[] = [];
  let offset = 0;
  for (const match of source.matchAll(pattern)) {
    result.push(source.slice(offset, match.index));
    const kind = rules.find(
      ([name]) => match.groups?.[name] !== undefined,
    )?.[0];
    result.push(
      <span key={match.index} className={`code-token--${kind}`}>
        {match[0]}
      </span>,
    );
    offset = match.index + match[0].length;
  }
  result.push(source.slice(offset));
  return result;
}

export function SyntaxCode({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  const tokens = useMemo(() => highlight(code, language), [code, language]);
  return <code className={`syntax-code language-${language}`}>{tokens}</code>;
}

export function GuideCode({
  children,
  className,
  ...props
}: ComponentProps<"code">) {
  const language = /language-([\w-]+)/.exec(className ?? "")?.[1];
  return language && typeof children === "string" ? (
    <SyntaxCode code={children} language={language} />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
