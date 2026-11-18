import { useEffect, useMemo, useRef, useState } from "react";
import { useKeyPress } from "../src";
import { catalog } from "./catalog";

const entries = [
  {
    name: "使用指南",
    category: "入门",
    description: "安装、快速开始、组合使用与行为约定。",
    href: "#/guide",
  },
  ...catalog.map((hook) => ({ ...hook, href: `#/hooks/${hook.name}` })),
];

export default function SiteSearch() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘ K"
    : "Ctrl K";
  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return entries.filter((item) =>
      terms.every((term) =>
        `${item.name} ${item.category} ${item.description}`
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [query]);
  const selected = results[active];
  const close = () => dialog.current?.close();
  const show = () => {
    if (dialog.current?.open) return;
    setQuery("");
    setActive(0);
    dialog.current?.showModal();
    setOpen(true);
    input.current?.focus();
  };
  const select = (href: string) => {
    close();
    window.location.hash = href;
  };
  useKeyPress(
    ["meta+k", "ctrl+k"],
    () => (dialog.current?.open ? close() : show()),
    {
      allowInInput: true,
      preventDefault: true,
      repeat: false,
      priority: 100,
    },
  );
  useEffect(() => {
    const navigate = () => dialog.current?.close();
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    if (open && selected)
      document
        .getElementById(`site-search-${selected.name}`)
        ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [open, selected]);
  return (
    <>
      <button
        type="button"
        className="site-search-trigger"
        onClick={show}
        aria-label="打开站点搜索"
        aria-keyshortcuts="Meta+K Control+K"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-search-dialog"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
        <span>搜索文档</span>
        <kbd>{shortcut}</kbd>
      </button>
      <dialog
        ref={dialog}
        id="site-search-dialog"
        className="site-search-dialog"
        aria-labelledby="site-search-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            close();
        }}
      >
        <div className="site-search-heading">
          <h2 id="site-search-title">搜索文档</h2>
          <button
            type="button"
            className="site-search-close"
            aria-label="关闭站点搜索"
            onClick={close}
          >
            Esc <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="site-search-input-wrap">
          <input
            ref={input}
            role="combobox"
            aria-label="搜索文档关键词"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="site-search-results"
            aria-activedescendant={
              selected ? `site-search-${selected.name}` : undefined
            }
            placeholder="搜索 Hook 名称、功能或分类…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (results.length)
                  setActive(
                    (index) =>
                      (index +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        results.length) %
                      results.length,
                  );
              } else if (event.key === "Enter" && selected) {
                event.preventDefault();
                select(selected.href);
              }
            }}
          />
        </div>
        <p className="site-search-count" role="status">
          {query.trim()
            ? `找到 ${results.length} 个结果`
            : "浏览全部 Hooks 与使用指南"}
        </p>
        <ul
          id="site-search-results"
          className="site-search-results"
          role="listbox"
          aria-label="文档搜索结果"
        >
          {results.map((item, index) => (
            <li
              key={item.name}
              id={`site-search-${item.name}`}
              role="option"
              aria-selected={index === active}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(item.href)}
            >
              <div>
                <strong>{item.name}</strong>
                <span>{item.category}</span>
              </div>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        {!results.length && (
          <p className="site-search-empty">
            没有找到相关文档，试试其他名称或关键词。
          </p>
        )}
        <div className="site-search-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> 选择
          </span>
          <span>
            <kbd>Enter</kbd> 打开
          </span>
          <span>
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </dialog>
    </>
  );
}
