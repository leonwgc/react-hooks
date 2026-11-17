import { useEffect, useRef, useState } from "react";
import {
  useTable,
  useSelection,
  useEditor,
  useForm,
  type TableQuery,
} from "../../src";
type Article = { id: number; title: string; category: string };
const initialArticles: Article[] = Array.from({ length: 26 }, (_, index) => ({
  id: index + 1,
  title:
    ["React 状态管理", "表单交互设计", "浏览器 API 实践", "动画体验指南"][
      index % 4
    ] + ` ${index + 1}`,
  category: index % 2 === 0 ? "技术" : "设计",
}));
export default function Demo() {
  const [articles, setArticles] = useState(initialArticles);
  const [fail, setFail] = useState(false);
  const table = useTable<Article, { keyword: string }>(
    async ({ signal }, query: TableQuery<{ keyword: string }>) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", abort);
          resolve();
        }, 350);
        function abort() {
          clearTimeout(timer);
          reject(new DOMException("Cancelled", "AbortError"));
        }
        signal.addEventListener("abort", abort, { once: true });
      });
      if (fail) throw new Error("模拟请求失败");
      let matches = articles.filter((article) =>
        article.title.includes(query.filters.keyword),
      );
      if (query.sort)
        matches = [...matches].sort((a, b) =>
          query.sort?.order === "asc" ? a.id - b.id : b.id - a.id,
        );
      return {
        list: matches.slice(
          (query.page - 1) * query.pageSize,
          query.page * query.pageSize,
        ),
        total: matches.length,
      };
    },
    {
      initialFilters: { keyword: "" },
      pageSize: 5,
      select: (response) => response,
    },
  );
  const selection = useSelection(
    table.list.map((article) => article.id),
    { preserve: true, resetKey: table.search.submitted },
  );
  const editor = useEditor<Article>();
  const form = useForm({
    initialValues: { title: "", category: "技术" },
    validators: {
      title: (value) => (!value.trim() ? "请输入文章标题" : undefined),
    },
  });
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (editor.isOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [editor.isOpen]);
  useEffect(() => {
    table.refresh();
  }, [articles, table.refresh]);
  return (
    <div className="demo-stack table-demo">
      <form
        className="demo-row"
        onSubmit={(event) => {
          event.preventDefault();
          table.search.submit();
        }}
      >
        <label className="grow">
          文章搜索
          <input
            value={table.search.draft.keyword}
            onChange={(e) => table.search.setDraft({ keyword: e.target.value })}
            placeholder="输入标题关键词"
          />
        </label>
        <button>查询</button>
        <button
          type="button"
          className="secondary"
          onClick={table.search.reset}
        >
          重置
        </button>
      </form>
      <div className="demo-row">
        <button
          className="secondary"
          onClick={() => {
            form.reset({ title: "", category: "技术" });
            editor.create();
          }}
        >
          新建文章
        </button>
        <button
          className="secondary"
          onClick={() =>
            table.setSort({
              field: "id",
              order: table.sort?.order === "desc" ? "asc" : "desc",
            })
          }
        >
          ID {table.sort?.order === "desc" ? "降序 ↓" : "升序 ↑"}
        </button>
        <label className="check">
          <input
            type="checkbox"
            checked={fail}
            onChange={(e) => setFail(e.target.checked)}
          />
          模拟失败
        </label>
        <span className="muted">已选 {selection.selectedKeys.length} 项</span>
      </div>
      {table.error ? (
        <div role="alert" className="notice">
          加载失败。关闭失败开关后 <button onClick={table.refresh}>重试</button>
        </div>
      ) : null}
      <div className="table-wrap" aria-busy={table.loading}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  aria-label="选择本页全部文章"
                  type="checkbox"
                  checked={selection.allSelected}
                  onChange={selection.toggleAll}
                />
              </th>
              <th>ID</th>
              <th>文章标题</th>
              <th>分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {table.list.map((article) => (
              <tr key={article.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`选择文章 ${article.id}`}
                    checked={selection.isSelected(article.id)}
                    onChange={() => selection.toggle(article.id)}
                  />
                </td>
                <td className="muted">{String(article.id).padStart(2, "0")}</td>
                <td>{article.title}</td>
                <td>
                  <span className="tag">{article.category}</span>
                </td>
                <td>
                  <button
                    className="text-button"
                    onClick={() => {
                      form.reset({
                        title: article.title,
                        category: article.category,
                      });
                      editor.edit(article);
                    }}
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!table.list.length && (
          <p className="empty">
            {table.loading ? "加载中…" : "没有匹配的文章，试试其他关键词。"}
          </p>
        )}
      </div>
      <div className="demo-row spread">
        <span className="muted" aria-live="polite">
          {table.loading
            ? "正在加载…"
            : `共 ${table.total} 篇文章 · 第 ${table.page} 页`}
        </span>
        <div className="demo-row">
          <button
            className="secondary"
            disabled={table.page === 1 || table.loading}
            onClick={() => table.setPage(table.page - 1)}
          >
            上一页
          </button>
          <button
            className="secondary"
            disabled={
              table.page * table.pageSize >= table.total || table.loading
            }
            onClick={() => table.setPage(table.page + 1)}
          >
            下一页
          </button>
          <select
            aria-label="每页条数"
            value={table.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            <option value={5}>5 条/页</option>
            <option value={10}>10 条/页</option>
          </select>
        </div>
      </div>
      <dialog
        ref={dialog}
        onCancel={editor.close}
        onClose={editor.close}
        aria-labelledby="article-editor-title"
      >
        <form
          className="demo-stack"
          onSubmit={form.handleSubmit((values) => {
            setArticles((previous) =>
              editor.mode === "edit"
                ? previous.map((article) =>
                    article.id === editor.record?.id
                      ? { ...article, ...values }
                      : article,
                  )
                : [
                    ...previous,
                    {
                      id: Math.max(0, ...previous.map((a) => a.id)) + 1,
                      ...values,
                    },
                  ],
            );
            editor.close();
          })}
        >
          <h3 id="article-editor-title">
            {editor.mode === "create" ? "新建文章" : "编辑文章"}
          </h3>
          <label>
            文章标题
            <input {...form.register("title")} />
          </label>
          <small className="error">{form.errors.title}</small>
          <label>
            分类
            <select {...form.register("category")}>
              <option>技术</option>
              <option>设计</option>
            </select>
          </label>
          <div className="demo-row">
            <button disabled={form.isSubmitting}>保存</button>
            <button type="button" className="secondary" onClick={editor.close}>
              取消
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
