import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { resolveTarget, type Target } from "../internal/utils.js";
const useBrowserLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;
const titles = new WeakMap<
  Document,
  { base: string; applied: string; owners: Map<symbol, string> }
>();
export function useDocumentTitle(
  title: string,
  options: { restoreOnUnmount?: boolean } = {},
) {
  const token = useRef(Symbol());
  const latest = useLatest({
    title,
    restore: options.restoreOnUnmount !== false,
  });
  useEffect(() => {
    const documentState = titles.get(document) ?? {
      base: document.title,
      applied: document.title,
      owners: new Map<symbol, string>(),
    };
    titles.set(document, documentState);
    documentState.owners.set(token.current, latest.current.title);
    document.title = documentState.applied = latest.current.title;
    const owner = token.current;
    return () => {
      documentState.owners.delete(owner);
      if (document.title === documentState.applied) {
        const remaining = [...documentState.owners.values()].at(-1);
        if (remaining !== undefined || latest.current.restore)
          document.title = documentState.applied =
            remaining ?? documentState.base;
      }
      if (!documentState.owners.size) titles.delete(document);
    };
  }, [latest]);
  useEffect(() => {
    const state = titles.get(document);
    if (!state) return;
    state.owners.set(token.current, title);
    if ([...state.owners.keys()].at(-1) === token.current)
      document.title = state.applied = title;
  }, [title]);
}
export function useObjectURL(input: Blob | null) {
  const [state, setState] = useState<{
    input: Blob | null;
    url: string | null;
    error: unknown;
    supported: boolean;
  }>({ input: null, url: null, error: undefined, supported: false });
  useEffect(() => {
    const supported =
      typeof URL !== "undefined" &&
      typeof URL.createObjectURL === "function" &&
      typeof URL.revokeObjectURL === "function";
    if (!input || !supported) {
      setState({ input, url: null, error: undefined, supported });
      return;
    }
    let url: string;
    try {
      url = URL.createObjectURL(input);
      setState({ input, url, error: undefined, supported });
    } catch (error) {
      setState({ input, url: null, error, supported });
      return;
    }
    return () => URL.revokeObjectURL(url);
  }, [input]);
  return {
    url: input === state.input ? state.url : null,
    error: input === state.input ? state.error : undefined,
    supported: state.supported,
  };
}
export function useTextareaAutoSize(
  target: Target<HTMLTextAreaElement>,
  value: string,
  options: { minRows?: number; maxRows?: number; enabled?: boolean } = {},
) {
  const [height, setHeight] = useState(0);
  const enabled = options.enabled !== false;
  const minRows = Number.isFinite(options.minRows)
    ? Math.max(1, options.minRows!)
    : 1;
  const maxRows = Number.isFinite(options.maxRows)
    ? Math.max(minRows, options.maxRows!)
    : Infinity;
  const resize = useMemoizedFn(() => {
    const node = resolveTarget(target);
    if (!node || !enabled) return;
    const style = getComputedStyle(node);
    const number = (value: string) => Number.parseFloat(value) || 0;
    const line =
      number(style.lineHeight) || (number(style.fontSize) || 16) * 1.2;
    const padding = number(style.paddingTop) + number(style.paddingBottom);
    const border =
      number(style.borderTopWidth) + number(style.borderBottomWidth);
    node.style.height = "0px";
    const content = Math.max(0, node.scrollHeight - padding);
    const size = Math.max(minRows * line, Math.min(maxRows * line, content));
    const next =
      size + (style.boxSizing === "border-box" ? padding + border : 0);
    node.style.height = `${next}px`;
    node.style.overflowY = content > maxRows * line ? "auto" : "hidden";
    setHeight((previous) => (previous === next ? previous : next));
  });
  const binding = useRef<{
    node: HTMLTextAreaElement;
    cleanup: () => void;
  } | null>(null);
  // Refs may start pointing at a new textarea without changing the ref object.
  useBrowserLayoutEffect(() => {
    const node = enabled ? resolveTarget(target) : null;
    if (binding.current?.node !== node) {
      binding.current?.cleanup();
      binding.current = null;
      if (node) {
        const original = {
          height: node.style.height,
          overflowY: node.style.overflowY,
        };
        let width = node.getBoundingClientRect().width;
        const observer =
          typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => {
                const next = node.getBoundingClientRect().width;
                if (width !== next) {
                  width = next;
                  resize();
                }
              });
        observer?.observe(node);
        node.addEventListener("input", resize);
        window.addEventListener("resize", resize);
        binding.current = {
          node,
          cleanup: () => {
            observer?.disconnect();
            node.removeEventListener("input", resize);
            window.removeEventListener("resize", resize);
            node.style.height = original.height;
            node.style.overflowY = original.overflowY;
          },
        };
      }
    }
    if (node) resize();
    else setHeight((previous) => (previous === 0 ? previous : 0));
  });
  useBrowserLayoutEffect(
    () => () => {
      binding.current?.cleanup();
      binding.current = null;
    },
    [],
  );
  return { height, resize };
}
