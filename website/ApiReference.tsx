import type { ComponentType } from "react";
import type { HookName } from "./catalog";
import { apiDocs } from "./api";
import type { ApiParameter, ApiValue } from "./api/types";

function ApiTable({
  id,
  title,
  rows,
  parameters = false,
}: {
  id: string;
  title: string;
  rows: readonly (ApiValue | ApiParameter)[];
  parameters?: boolean;
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
              <th scope="col">类型 / 签名</th>
              {parameters && <th scope="col">默认值 / 必填</th>}
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">
                  <code>{row.name}</code>
                </th>
                <td data-label="类型 / 签名">
                  <code>{row.type}</code>
                </td>
                {parameters && (
                  <td data-label="默认值 / 必填">
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
        按当前实现逐项说明。参数表中的“必填”表示不可省略，其余为省略时的默认值。
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
      {api.parameters.length ? (
        <ApiTable
          id="api-parameters"
          title="调用参数"
          rows={api.parameters}
          parameters
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
        />
      ))}
      {api.returns.length ? (
        <ApiTable id="api-returns" title="返回值" rows={api.returns} />
      ) : (
        <div className="api-group" id="api-returns">
          <h3>返回值</h3>
          <p>返回包含下列方法的对象，无额外状态字段。</p>
        </div>
      )}
      {!!api.methods?.length && (
        <ApiTable id="api-methods" title="方法" rows={api.methods} />
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
