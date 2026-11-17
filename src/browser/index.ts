import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type SetStateAction,
} from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import { equal, resolveTarget, type Target } from "../internal/utils.js";

export function useEventListener<E extends Event = Event>(
  type: string,
  listener: (event: E) => void,
  target?: Target<EventTarget>,
  options?: AddEventListenerOptions,
) {
  const handler = useMemoizedFn((event: Event) => listener(event as E));
  // Runs after each commit so replacement DOM nodes are also observed.
  useEffect(() => {
    const node = target === undefined ? window : resolveTarget(target);
    node?.addEventListener(type, handler, options);
    return () => node?.removeEventListener(type, handler, options);
  });
}
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!window.matchMedia) return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () =>
      typeof window.matchMedia === "function"
        ? window.matchMedia(query).matches
        : serverValue,
    () => serverValue,
  );
}
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}
export function useElementSize(target: Target<Element>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const node = resolveTarget(target);
    if (!node) return;
    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    };
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  });
  return size;
}
export function useIntersectionObserver(
  target: Target<Element>,
  options?: IntersectionObserverInit,
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const optionsRef = useRef<IntersectionObserverInit | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const node = resolveTarget(target);
    const unchanged =
      node === nodeRef.current &&
      options?.root === optionsRef.current?.root &&
      options?.rootMargin === optionsRef.current?.rootMargin &&
      equal(options?.threshold, optionsRef.current?.threshold);
    if (unchanged) return;
    observerRef.current?.disconnect();
    nodeRef.current = node;
    optionsRef.current = options;
    if (node && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => setEntry(entries[0] ?? null),
        options,
      );
      observer.observe(node);
      observerRef.current = observer;
    } else setEntry((previous) => (previous === null ? previous : null));
  });
  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      nodeRef.current = null;
    },
    [],
  );
  return entry;
}
export function useScroll(target?: Target<Element>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const node = target === undefined ? window : resolveTarget(target);
    if (!node) return;
    const update = () => {
      const next =
        node instanceof Window
          ? { x: node.scrollX, y: node.scrollY }
          : { x: node.scrollLeft, y: node.scrollTop };
      setPosition((previous) => (equal(previous, next) ? previous : next));
    };
    update();
    node.addEventListener("scroll", update, { passive: true });
    return () => node.removeEventListener("scroll", update);
  });
  return position;
}
export function useClickOutside(
  target: Target<Element>,
  callback: (event: PointerEvent) => void,
  enabled = true,
) {
  useEventListener<PointerEvent>(
    "pointerdown",
    (event) => {
      const node = resolveTarget(target);
      if (enabled && node && !event.composedPath().includes(node))
        callback(event);
    },
    () => document,
  );
}
export function useKeyPress(
  keys: string | readonly string[],
  callback: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean;
    allowInInput?: boolean;
    target?: Target<EventTarget>;
  } = {},
) {
  useEventListener<KeyboardEvent>(
    "keydown",
    (event) => {
      const node = event.target;
      const editable =
        node instanceof HTMLElement &&
        (node.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(node.tagName));
      if (
        options.enabled === false ||
        (editable && !options.allowInInput) ||
        event.isComposing
      )
        return;
      if ((typeof keys === "string" ? [keys] : keys).includes(event.key))
        callback(event);
    },
    options.target,
  );
}
export function useClipboard() {
  const [state, setState] = useState<{ copied: boolean; error: unknown }>({
    copied: false,
    error: undefined,
  });
  const version = useRef(0);
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );
  const copy = useMemoizedFn(async (text: string): Promise<boolean> => {
    const id = ++version.current;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error(
          "Clipboard API is unavailable; use HTTPS and a user gesture.",
        );
      await navigator.clipboard.writeText(text);
      if (id === version.current) setState({ copied: true, error: undefined });
      return true;
    } catch (error) {
      if (id === version.current) setState({ copied: false, error });
      return false;
    }
  });
  const reset = useMemoizedFn(() => {
    version.current++;
    setState({ copied: false, error: undefined });
  });
  return { ...state, copy, reset };
}
const subscribeOnline = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};
export function useOnline() {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
}
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
export function usePageVisibility() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState,
    () => "visible" as DocumentVisibilityState,
  );
}
export function useCountdown(
  target: number | null,
  options: { interval?: number; onEnd?: () => void } = {},
) {
  const [remaining, setRemaining] = useState(0);
  const onEnd = useMemoizedFn(() => options.onEnd?.());
  const endedTarget = useRef<number | null>(null);
  useEffect(() => {
    if (target === null) {
      setRemaining(0);
      endedTarget.current = null;
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const next = Math.max(0, target - Date.now());
      setRemaining(next);
      if (next > 0)
        timer = setTimeout(
          tick,
          Math.min(next, Math.max(16, options.interval ?? 1000)),
        );
      else if (endedTarget.current !== target) {
        endedTarget.current = target;
        onEnd();
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [target, options.interval, onEnd]);
  return {
    remaining,
    seconds: Math.ceil(remaining / 1000),
    finished: target !== null && remaining === 0,
  };
}

const storageEvent = "web-hooks:storage";
function useStorageState<T>(
  area: "localStorage" | "sessionStorage",
  key: string,
  initial: T,
) {
  const defaults = useLatest(initial);
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<unknown>();
  const current = useRef({ key, value: initial });
  const read = useMemoizedFn((): T => {
    const raw = window[area].getItem(key);
    return raw === null ? defaults.current : (JSON.parse(raw) as T);
  });
  useEffect(() => {
    const update = () => {
      try {
        const next = read();
        current.current = { key, value: next };
        setValue((previous) => (equal(previous, next) ? previous : next));
        setError(undefined);
      } catch (reason) {
        setError(reason);
        current.current = { key, value: defaults.current };
        setValue(defaults.current);
      }
    };
    const onStorage = (event: StorageEvent) => {
      try {
        if (
          (event.key === key || event.key === null) &&
          event.storageArea === window[area]
        )
          update();
      } catch (reason) {
        setError(reason);
      }
    };
    const onLocal = (event: Event) => {
      const detail = (event as CustomEvent<{ area: string; key: string }>)
        .detail;
      if (detail.area === area && detail.key === key) update();
    };
    update();
    window.addEventListener("storage", onStorage);
    window.addEventListener(storageEvent, onLocal);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(storageEvent, onLocal);
    };
  }, [area, key, read, defaults]);
  const set = useMemoizedFn((action: SetStateAction<T>) => {
    try {
      const previous = read();
      const next =
        typeof action === "function"
          ? (action as (value: T) => T)(previous)
          : action;
      const serialized = JSON.stringify(next);
      if (serialized === undefined)
        throw new TypeError("Storage values must be JSON serializable.");
      window[area].setItem(key, serialized);
      current.current = { key, value: next };
      setValue(next);
      setError(undefined);
      window.dispatchEvent(
        new CustomEvent(storageEvent, { detail: { area, key } }),
      );
    } catch (reason) {
      setError(reason);
    }
  });
  const remove = useMemoizedFn(() => {
    try {
      window[area].removeItem(key);
      setValue(defaults.current);
      setError(undefined);
      window.dispatchEvent(
        new CustomEvent(storageEvent, { detail: { area, key } }),
      );
    } catch (reason) {
      setError(reason);
    }
  });
  return { value, setValue: set, remove, error };
}
export function useLocalStorageState<T>(key: string, initial: T) {
  return useStorageState("localStorage", key, initial);
}
export function useSessionStorageState<T>(key: string, initial: T) {
  return useStorageState("sessionStorage", key, initial);
}

const urlEvent = "web-hooks:url";
export function useUrlState(
  initial: Record<string, string> = {},
  mode: "replace" | "push" = "replace",
) {
  const defaults = useLatest(initial);
  const [state, update] = useState(initial);
  useEffect(() => {
    const read = () =>
      update({
        ...defaults.current,
        ...Object.fromEntries(new URLSearchParams(window.location.search)),
      });
    read();
    window.addEventListener("popstate", read);
    window.addEventListener(urlEvent, read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener(urlEvent, read);
    };
  }, [defaults]);
  const setState = useMemoizedFn((patch: Record<string, string | null>) => {
    const url = new URL(window.location.href);
    Object.entries(patch).forEach(([key, value]) =>
      value === null
        ? url.searchParams.delete(key)
        : url.searchParams.set(key, value),
    );
    window.history[mode === "push" ? "pushState" : "replaceState"](
      window.history.state,
      "",
      url,
    );
    window.dispatchEvent(new Event(urlEvent));
  });
  return [state, setState] as const;
}
