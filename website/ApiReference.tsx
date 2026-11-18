import type { ComponentType } from "react";
import type { HookName } from "./catalog";
import { apiDocs } from "./api";
import type { ApiParameter, ApiValue } from "./api/types";
import { describeReturn } from "./api/returnStructure";

function ApiTable({
  id,
  title,
  rows,
  parameters = false,
  generics = [],
  genericDefinitions = false,
  nested = false,
  nameLabel = "名称",
}: {
  id: string;
  title: string;
  rows: readonly (ApiValue | ApiParameter)[];
  parameters?: boolean;
  generics?: readonly ApiParameter[];
  genericDefinitions?: boolean;
  nested?: boolean;
  nameLabel?: string;
}) {
  const Heading = nested ? "h4" : "h3";
  return (
    <div className="api-group" id={id}>
      <Heading id={`${id}-heading`}>{title}</Heading>
      <div className="table-wrap">
        <table
          className={`api-table api-detail-table${parameters ? " api-parameter-table" : ""}`}
          aria-labelledby={`${id}-heading`}
        >
          <thead>
            <tr>
              <th scope="col">{nameLabel}</th>
              <th scope="col">
                {genericDefinitions ? "类型约束" : "类型 / 签名"}
              </th>
              {parameters && (
                <th scope="col">
                  {genericDefinitions ? "默认类型" : "默认值 / 必填"}
                </th>
              )}
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">
                  <code>{row.name}</code>
                </th>
                <td
                  data-label={genericDefinitions ? "类型约束" : "类型 / 签名"}
                >
                  <code>
                    {genericDefinitions && row.type === "unknown"
                      ? "无约束"
                      : row.type}
                  </code>
                  {generics
                    .filter((generic) =>
                      row.type.split(/\W+/).includes(generic.name),
                    )
                    .map((generic) => (
                      <details className="api-type-help" key={generic.name}>
                        <summary>{generic.name} 类型说明</summary>
                        <p>{generic.description}</p>
                        <p>
                          约束：
                          <code>
                            {generic.type === "unknown"
                              ? "无约束"
                              : generic.type}
                          </code>
                          ；默认类型：<code>{generic.defaultValue}</code>。
                        </p>
                      </details>
                    ))}
                </td>
                {parameters && (
                  <td
                    data-label={
                      genericDefinitions ? "默认类型" : "默认值 / 必填"
                    }
                  >
                    <code>
                      {"defaultValue" in row ? row.defaultValue : "—"}
                    </code>
                  </td>
                )}
                <td data-label="说明">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function ApiReference({
  name,
  CodeBlock,
}: {
  name: HookName;
  CodeBlock: ComponentType<{ code: string }>;
}) {
  const api = apiDocs[name];
  const result = describeReturn(name, api);
  const links = [
    ...(api.generics?.length
      ? [{ id: "api-generics", title: "泛型说明" }]
      : []),
    { id: "api-parameters", title: "调用参数" },
    ...(api.sections ?? []).map((section, i) => ({
      id: `api-options-${i}`,
      title: section.title,
    })),
    { id: "api-result", title: "返回值" },
    ...(api.types ? [{ id: "api-types", title: "关联类型" }] : []),
  ];
  return (
    <div className="api-reference">
      <p className="api-intro">
        调用签名列出 TypeScript 参数类型；返回结构及其成员见下表。?
        表示可省略，参数表中的“必填”表示不可省略，其余为省略时的默认值。泛型由传入值推断，也可显式指定；类型列中的说明可展开查看。
        <a
          href={`https://github.com/leonwgc/react-hooks/blob/master/${api.source}`}
          target="_blank"
          rel="noreferrer"
        >
          查看实现 ↗
        </a>
      </p>
      <CodeBlock code={api.signature} />
      <nav className="api-jump-links" aria-label={`${name} API 目录`}>
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() =>
              document.getElementById(link.id)?.scrollIntoView({
                block: "start",
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            {link.title}
          </button>
        ))}
      </nav>
      {!!api.generics?.length && (
        <>
          <ApiTable
            id="api-generics"
            title="泛型说明"
            rows={api.generics}
            parameters
            genericDefinitions
          />
          {api.typeExample && <CodeBlock code={api.typeExample} />}
        </>
      )}
      {api.parameters.length ? (
        <ApiTable
          id="api-parameters"
          title="调用参数"
          rows={api.parameters}
          parameters
          generics={api.generics}
        />
      ) : (
        <div className="api-group" id="api-parameters">
          <h3>调用参数</h3>
          <p>无需传入参数。</p>
        </div>
      )}
      {api.sections?.map((section, i) => (
        <ApiTable
          key={section.title}
          id={`api-options-${i}`}
          title={section.title}
          rows={section.rows}
          parameters
          generics={api.generics}
        />
      ))}
      <section
        id="api-result"
        className="api-group api-result"
        aria-labelledby="api-result-heading"
      >
        <h3 id="api-result-heading">返回值</h3>
        <p>{result.description}</p>
        <details className="return-structure">
          <summary>查看完整返回类型</summary>
          <CodeBlock code={result.type} />
        </details>
        {api.returns.length || result.kind === "tuple" ? (
          <ApiTable
            id="api-returns"
            title={
              result.kind === "object"
                ? "对象属性"
                : result.kind === "tuple"
                  ? "元组元素"
                  : result.kind === "function"
                    ? "返回的函数"
                    : "返回值说明"
            }
            nameLabel={
              result.kind === "object"
                ? "属性"
                : result.kind === "tuple"
                  ? "位置 / 示例变量"
                  : result.kind === "void"
                    ? "返回类型"
                    : "示例变量"
            }
            rows={
              result.kind === "tuple"
                ? [...api.returns, ...(api.methods ?? [])]
                : api.returns
            }
            generics={api.generics}
            nested
          />
        ) : (
          <div className="api-group" id="api-returns">
            <p>此返回对象只包含下列方法，无额外状态属性。</p>
          </div>
        )}
        {result.kind === "object" && !!api.methods?.length && (
          <ApiTable
            id="api-methods"
            title="对象方法"
            nameLabel="方法"
            rows={api.methods}
            generics={api.generics}
            nested
          />
        )}
      </section>
      {api.types && (
        <div className="api-group" id="api-types">
          <h3>关联类型</h3>
          <CodeBlock code={api.types} />
        </div>
      )}
      {!!api.notes?.length && (
        <div className="api-group api-notes">
          <h3>使用约定</h3>
          <ul>
            {api.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
