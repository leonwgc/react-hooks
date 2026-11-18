import type { ComponentType } from "react";
import type { HookName } from "./catalog";
import { apiDocs } from "./api";
import type { ApiParameter, ApiValue } from "./api/types";

function ApiTable({
  id,
  title,
  rows,
  parameters = false,
  generics = [],
  genericDefinitions = false,
}: {
  id: string;
  title: string;
  rows: readonly (ApiValue | ApiParameter)[];
  parameters?: boolean;
  generics?: readonly ApiParameter[];
  genericDefinitions?: boolean;
}) {
  return (
    <div className="api-group" id={id}>
      <h3 id={`${id}-heading`}>{title}</h3>
      <div className="table-wrap">
        <table
          className={`api-table api-detail-table${parameters ? " api-parameter-table" : ""}`}
          aria-labelledby={`${id}-heading`}
        >
          <thead>
            <tr>
              <th scope="col">名称</th>
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
  const links = [
    ...(api.generics?.length
      ? [{ id: "api-generics", title: "泛型说明" }]
      : []),
    { id: "api-parameters", title: "调用参数" },
    ...(api.sections ?? []).map((section, i) => ({
      id: `api-options-${i}`,
      title: section.title,
    })),
    { id: "api-returns", title: "返回值" },
    ...(api.methods?.length ? [{ id: "api-methods", title: "方法" }] : []),
    ...(api.types ? [{ id: "api-types", title: "关联类型" }] : []),
  ];
  return (
    <div className="api-reference">
      <p className="api-intro">
        调用签名列出 TypeScript 参数类型；返回值和方法见下表。?
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
      {api.returns.length ? (
        <ApiTable
          id="api-returns"
          title="返回值"
          rows={api.returns}
          generics={api.generics}
        />
      ) : (
        <div className="api-group" id="api-returns">
          <h3>返回值</h3>
          <p>返回包含下列方法的对象，无额外状态字段。</p>
        </div>
      )}
      {!!api.methods?.length && (
        <ApiTable
          id="api-methods"
          title="方法"
          rows={api.methods}
          generics={api.generics}
        />
      )}
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
