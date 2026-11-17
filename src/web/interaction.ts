import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type DragEvent,
} from "react";
import { useMemoizedFn, useLatest } from "../state/index.js";
import { equal, resolveTarget, type Target } from "../internal/utils.js";

export function useUndoRedo<T>(
  initial: T,
  { limit = 100 }: { limit?: number } = {},
) {
  const [history, setHistory] = useState({
    past: [] as T[],
    present: initial,
    future: [] as T[],
  });
  const set = useMemoizedFn(
    (value: T | ((previous: T) => T), options: { replace?: boolean } = {}) => {
      setHistory((h) => {
        const next =
          typeof value === "function"
            ? (value as (previous: T) => T)(h.present)
            : value;
        if (Object.is(next, h.present)) return h;
        return {
          past: options.replace
            ? h.past
            : [...h.past, h.present].slice(-Math.max(1, Math.floor(limit))),
          present: next,
          future: [],
        };
      });
    },
  );
  const undo = useMemoizedFn(() =>
    setHistory((h) =>
      h.past.length
        ? {
            past: h.past.slice(0, -1),
            present: h.past[h.past.length - 1]!,
            future: [h.present, ...h.future],
          }
        : h,
    ),
  );
  const redo = useMemoizedFn(() =>
    setHistory((h) =>
      h.future.length
        ? {
            past: [...h.past, h.present],
            present: h.future[0]!,
            future: h.future.slice(1),
          }
        : h,
    ),
  );
  const reset = useMemoizedFn((value: T) =>
    setHistory({ past: [], present: value, future: [] }),
  );
  const clear = useMemoizedFn(() =>
    setHistory((h) => ({ ...h, past: [], future: [] })),
  );
  return {
    value: history.present,
    set,
    undo,
    redo,
    reset,
    clear,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}

export function useLeaveConfirm(
  dirty: boolean,
  options: {
    confirm?: () => boolean | Promise<boolean>;
    message?: string;
  } = {},
) {
  const latest = useLatest({ dirty, ...options });
  const pending = useRef<Promise<boolean> | undefined>(undefined);
  useEffect(() => {
    if (!dirty) return;
    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", listener);
    return () => window.removeEventListener("beforeunload", listener);
  }, [dirty]);
  const confirmLeave = useMemoizedFn((): Promise<boolean> => {
    if (!latest.current.dirty) return Promise.resolve(true);
    if (pending.current) return pending.current;
    const request = Promise.resolve().then(() =>
      latest.current.confirm
        ? latest.current.confirm()
        : window.confirm(
            latest.current.message ?? "有未保存的修改，确定离开吗？",
          ),
    );
    pending.current = request;
    void request
      .finally(() => {
        if (pending.current === request) pending.current = undefined;
      })
      .catch(() => {});
    return request;
  });
  const guard = useMemoizedFn(async (navigate: () => void) => {
    if (!(await confirmLeave())) return false;
    navigate();
    return true;
  });
  return { confirmLeave, guard };
}

export function useFocusWithin() {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    bind: {
      onFocus: useMemoizedFn(() => setFocused(true)),
      onBlur: useMemoizedFn((event: FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }),
    },
  };
}

export function useLongPress(
  onLongPress: (event: PointerEvent<HTMLElement>) => void,
  options: { delay?: number; threshold?: number; disabled?: boolean } = {},
) {
  const [pressing, setPressing] = useState(false);
  const active = useRef<{ id: number; x: number; y: number } | undefined>(
    undefined,
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const call = useMemoizedFn(onLongPress);
  const cancel = useMemoizedFn(() => {
    clearTimeout(timer.current);
    active.current = undefined;
    setPressing(false);
  });
  useEffect(() => {
    if (options.disabled) cancel();
  }, [options.disabled, cancel]);
  useEffect(() => {
    window.addEventListener("blur", cancel);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("blur", cancel);
    };
  }, [cancel]);
  const onPointerDown = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    if (options.disabled || event.button !== 0 || active.current) return;
    active.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setPressing(true);
    timer.current = setTimeout(
      () => {
        timer.current = undefined;
        call(event);
      },
      Math.max(0, options.delay ?? 500),
    );
  });
  const onPointerMove = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    const start = active.current;
    if (
      start &&
      start.id === event.pointerId &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) >
        (options.threshold ?? 10)
    )
      cancel();
  });
  const end = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    if (active.current?.id === event.pointerId) cancel();
  });
  return {
    pressing,
    cancel,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture: end,
    },
  };
}

export function useDrag(
  data: string,
  options: {
    type?: string;
    effectAllowed?: DataTransfer["effectAllowed"];
    disabled?: boolean;
  } = {},
) {
  const [dragging, setDragging] = useState(false);
  const onDragStart = useMemoizedFn((event: DragEvent<HTMLElement>) => {
    if (options.disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData(options.type ?? "text/plain", data);
    event.dataTransfer.effectAllowed = options.effectAllowed ?? "copyMove";
    setDragging(true);
  });
  const onDragEnd = useMemoizedFn(() => setDragging(false));
  return {
    dragging,
    bind: { draggable: !options.disabled, onDragStart, onDragEnd },
  };
}

export function useDrop(
  onDrop: (
    payload: { text: string; files: File[] },
    event: DragEvent<HTMLElement>,
  ) => void,
  options: {
    type?: string;
    disabled?: boolean;
    dropEffect?: DataTransfer["dropEffect"];
  } = {},
) {
  const [over, setOver] = useState(false);
  const depth = useRef(0);
  const accepts = (event: DragEvent<HTMLElement>) =>
    !options.disabled &&
    (event.dataTransfer.types.includes(options.type ?? "text/plain") ||
      event.dataTransfer.types.includes("Files"));
  const reset = useMemoizedFn(() => {
    depth.current = 0;
    setOver(false);
  });
  useEffect(() => {
    if (options.disabled) reset();
  }, [options.disabled, reset]);
  useEffect(() => {
    window.addEventListener("dragend", reset);
    window.addEventListener("drop", reset);
    return () => {
      window.removeEventListener("dragend", reset);
      window.removeEventListener("drop", reset);
    };
  }, [reset]);
  return {
    over,
    bind: {
      onDragEnter: useMemoizedFn((event: DragEvent<HTMLElement>) => {
        if (accepts(event)) {
          event.preventDefault();
          depth.current++;
          setOver(true);
        }
      }),
      onDragOver: useMemoizedFn((event: DragEvent<HTMLElement>) => {
        if (accepts(event)) {
          event.preventDefault();
          event.dataTransfer.dropEffect = options.dropEffect ?? "copy";
        }
      }),
      onDragLeave: useMemoizedFn(() => {
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setOver(false);
      }),
      onDrop: useMemoizedFn((event: DragEvent<HTMLElement>) => {
        reset();
        if (!accepts(event)) return;
        event.preventDefault();
        onDrop(
          {
            text: event.dataTransfer.getData(options.type ?? "text/plain"),
            files: Array.from(event.dataTransfer.files),
          },
          event,
        );
      }),
    },
  };
}

export function useMutationObserver(
  target: Target<Node>,
  callback: MutationCallback,
  options: MutationObserverInit = { childList: true, subtree: true },
) {
  const callbackRef = useLatest(callback);
  const config = useRef(options);
  if (!equal(config.current, options)) config.current = options;
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<unknown>();
  const observer = useRef<MutationObserver | undefined>(undefined);
  const node = useRef<Node | null>(null);
  const previous = useRef<MutationObserverInit | undefined>(undefined);
  useEffect(() => {
    const available = typeof MutationObserver !== "undefined";
    setSupported(available);
    const current = resolveTarget(target);
    if (node.current === current && previous.current === config.current) return;
    observer.current?.disconnect();
    observer.current = undefined;
    node.current = current;
    previous.current = config.current;
    setError(undefined);
    if (!available || !current) return;
    try {
      const instance = new MutationObserver((...args) =>
        callbackRef.current(...args),
      );
      instance.observe(current, config.current);
      observer.current = instance;
    } catch (reason) {
      setError(reason);
    }
  });
  useEffect(
    () => () => {
      observer.current?.disconnect();
      node.current = null;
      previous.current = undefined;
    },
    [],
  );
  return {
    supported,
    error,
    disconnect: useMemoizedFn(() => observer.current?.disconnect()),
    takeRecords: useMemoizedFn(() => observer.current?.takeRecords() ?? []),
  };
}
