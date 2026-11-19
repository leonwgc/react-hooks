import { useEffect, useRef, useState } from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";
import {
  abortError,
  equal,
  resolveTarget,
  type Target,
} from "../internal/utils.js";

export function useImage(
  src: string | null,
  options: {
    fallback?: string;
    crossOrigin?: "anonymous" | "use-credentials";
  } = {},
) {
  type ImageState = {
    src: string | null;
    status: "idle" | "loading" | "loaded" | "error";
    error: Error | null;
    width: number;
    height: number;
  };
  const [stored, setStored] = useState<{ request: string | null } & ImageState>(
    { request: null, src: null, status: "idle", error: null, width: 0, height: 0 },
  );
  useEffect(() => {
    const setState = (next: ImageState) => setStored({ request: src, ...next });
    if (!src) {
      setState({ src: null, status: "idle", error: null, width: 0, height: 0 });
      return;
    }
    let active = true;
    let image: HTMLImageElement;
    const load = (url: string, isFallback: boolean) => {
      image = new Image();
      if (options.crossOrigin) image.crossOrigin = options.crossOrigin;
      setState({
        src: url,
        status: "loading",
        error: null,
        width: 0,
        height: 0,
      });
      image.onload = () => {
        if (active)
          setState({
            src: url,
            status: "loaded",
            error: null,
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
      };
      image.onerror = () => {
        if (!active) return;
        if (!isFallback && options.fallback && options.fallback !== url) {
          image.onload = null;
          image.onerror = null;
          load(options.fallback, true);
        } else
          setState({
            src: url,
            status: "error",
            error: new Error(`Image failed to load: ${url}`),
            width: 0,
            height: 0,
          });
      };
      image.src = url;
    };
    load(src, false);
    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [src, options.fallback, options.crossOrigin]);
  // Never report the previous image's result for a newly requested src.
  if (stored.request !== src) {
    const pending: ImageState = {
      src,
      status: src ? "loading" : "idle",
      error: null,
      width: 0,
      height: 0,
    };
    return pending;
  }
  const { request: _, ...state } = stored;
  return state;
}

type PrefixedDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type PrefixedElement = Element & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
const fullscreenElement = () =>
  document.fullscreenElement ??
  (document as PrefixedDocument).webkitFullscreenElement ??
  null;
const requestFullscreen = (node: Element) => {
  if (typeof node.requestFullscreen === "function")
    return node.requestFullscreen();
  const prefixed = (node as PrefixedElement).webkitRequestFullscreen;
  if (typeof prefixed === "function") return prefixed.call(node);
  throw new Error("Fullscreen is unavailable for this target.");
};
const exitFullscreen = () => {
  if (typeof document.exitFullscreen === "function")
    return document.exitFullscreen();
  return (document as PrefixedDocument).webkitExitFullscreen?.call(document);
};
export function useFullscreen(target: Target<Element>) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<unknown>();
  const mounted = useRef(false);
  const current = useLatest(target);
  useEffect(() => {
    mounted.current = true;
    const update = () => {
      const element = fullscreenElement();
      setActive(!!element && element === resolveTarget(current.current));
    };
    const root = document.documentElement as PrefixedElement;
    const prefixed = document as PrefixedDocument;
    setSupported(
      (typeof root.requestFullscreen === "function" ||
        typeof root.webkitRequestFullscreen === "function") &&
        (document.fullscreenEnabled ?? prefixed.webkitFullscreenEnabled) !==
          false,
    );
    update();
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    return () => {
      mounted.current = false;
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
    };
  });
  const enter = useMemoizedFn(async () => {
    try {
      const node = resolveTarget(target);
      if (!node) throw new Error("Fullscreen is unavailable for this target.");
      await requestFullscreen(node);
      if (mounted.current) {
        setError(undefined);
        setActive(fullscreenElement() === node);
      }
      return true;
    } catch (reason) {
      if (mounted.current) setError(reason);
      return false;
    }
  });
  const exit = useMemoizedFn(async () => {
    try {
      if (fullscreenElement() === resolveTarget(target)) await exitFullscreen();
      if (mounted.current) {
        setError(undefined);
        setActive(false);
      }
      return true;
    } catch (reason) {
      if (mounted.current) setError(reason);
      return false;
    }
  });
  const toggle = useMemoizedFn(() => {
    const element = fullscreenElement();
    return element && element === resolveTarget(target) ? exit() : enter();
  });
  return { supported, active, error, enter, exit, toggle };
}

export function useBroadcastChannel<T>(
  name: string | null,
  parse: (value: unknown) => T,
) {
  const [supported, setSupported] = useState(false);
  const [message, setMessage] = useState<T>();
  const [error, setError] = useState<unknown>();
  const channel = useRef<BroadcastChannel | undefined>(undefined);
  const parser = useMemoizedFn(parse);
  useEffect(() => {
    setMessage(undefined);
    setError(undefined);
    const available = typeof BroadcastChannel !== "undefined";
    setSupported(available);
    if (!available || name === null) return;
    let instance: BroadcastChannel;
    try {
      instance = new BroadcastChannel(name);
      channel.current = instance;
      instance.onmessage = (event: MessageEvent<unknown>) => {
        try {
          const next = parser(event.data);
          setMessage(() => next);
          setError(undefined);
        } catch (reason) {
          setError(reason);
        }
      };
      instance.onmessageerror = () =>
        setError(new Error("Broadcast message could not be deserialized."));
    } catch (reason) {
      setError(reason);
      return;
    }
    return () => {
      instance.onmessage = null;
      instance.onmessageerror = null;
      instance.close();
      if (channel.current === instance) channel.current = undefined;
    };
  }, [name, parser]);
  const postMessage = useMemoizedFn((value: T) => {
    try {
      if (!channel.current)
        throw new Error("BroadcastChannel is not connected.");
      channel.current.postMessage(value);
      setError(undefined);
      return true;
    } catch (reason) {
      setError(reason);
      return false;
    }
  });
  return { supported, message, error, postMessage };
}

export interface EventSourceConnection extends EventTarget {
  readonly readyState: number;
  close(): void;
}
export function useEventSource<T>(
  url: string | null,
  options: {
    parse: (data: string) => T;
    event?: string;
    withCredentials?: boolean;
    factory?: (url: string, options: EventSourceInit) => EventSourceConnection;
  },
) {
  const [status, setStatus] = useState<"closed" | "connecting" | "open">(
    "closed",
  );
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [revision, setRevision] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [supported, setSupported] = useState(false);
  const config = useLatest(options);
  const source = useRef<EventSourceConnection | undefined>(undefined);
  useEffect(() => {
    const available =
      !!config.current.factory || typeof EventSource !== "undefined";
    setSupported(available);
    setData(undefined);
    setError(undefined);
    if (!enabled || !url || !available) {
      setStatus("closed");
      return;
    }
    let instance: EventSourceConnection;
    try {
      instance = config.current.factory
        ? config.current.factory(url, {
            withCredentials: options.withCredentials,
          })
        : new EventSource(url, { withCredentials: options.withCredentials });
    } catch (reason) {
      setError(reason);
      setStatus("closed");
      return;
    }
    source.current = instance;
    setStatus("connecting");
    const open = () => {
      setStatus("open");
      setError(undefined);
    };
    const receive = (event: Event) => {
      if (!(event instanceof MessageEvent)) return;
      try {
        const next = config.current.parse(String(event.data));
        setData(() => next);
        setError(undefined);
      } catch (reason) {
        setError(reason);
      }
    };
    const fail = () => {
      setError(new Error("EventSource connection interrupted."));
      setStatus(instance.readyState === 2 ? "closed" : "connecting");
    };
    instance.addEventListener("open", open);
    instance.addEventListener(options.event ?? "message", receive);
    instance.addEventListener("error", fail);
    return () => {
      instance.removeEventListener("open", open);
      instance.removeEventListener(options.event ?? "message", receive);
      instance.removeEventListener("error", fail);
      instance.close();
      if (source.current === instance) source.current = undefined;
    };
  }, [url, options.event, options.withCredentials, config, revision, enabled]);
  const close = useMemoizedFn(() => {
    source.current?.close();
    setEnabled(false);
    setStatus("closed");
  });
  const reconnect = useMemoizedFn(() => {
    setEnabled(true);
    setRevision((n) => n + 1);
  });
  return { supported, data, status, error, close, reconnect };
}

export function useTextSelection(target?: Target<Element>) {
  const [selection, setStored] = useState<{
    text: string;
    rect: { x: number; y: number; width: number; height: number } | null;
  }>({ text: "", rect: null });
  const targetRef = useLatest(target);
  useEffect(() => {
    const setSelection = (next: typeof selection) =>
      setStored((previous) => (equal(previous, next) ? previous : next));
    const update = () => {
      const current = document.getSelection();
      const node =
        targetRef.current === undefined
          ? null
          : resolveTarget(targetRef.current);
      if (
        !current ||
        !current.rangeCount ||
        current.isCollapsed ||
        (targetRef.current !== undefined &&
          (!node ||
            !node.contains(current.anchorNode) ||
            !node.contains(current.focusNode)))
      ) {
        setSelection({ text: "", rect: null });
        return;
      }
      const range = current.getRangeAt(0);
      const bounds = range.getBoundingClientRect();
      setSelection({
        text: current.toString(),
        rect: {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        },
      });
    };
    update();
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [targetRef]);
  const clear = useMemoizedFn(() => {
    document.getSelection()?.removeAllRanges();
    setStored({ text: "", rect: null });
  });
  return { ...selection, clear };
}

export function useDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const controller = useRef<AbortController | undefined>(undefined);
  const sequence = useRef(0);
  const mounted = useRef(true);
  const urls = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const cancel = useMemoizedFn(() => {
    sequence.current++;
    controller.current?.abort();
    if (mounted.current) setLoading(false);
  });
  const save = useMemoizedFn((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timer = setTimeout(() => {
      URL.revokeObjectURL(url);
      urls.current.delete(url);
    }, 1000);
    urls.current.set(url, timer);
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    try {
      link.click();
    } finally {
      link.remove();
    }
  });
  const download = useMemoizedFn(
    async (
      input: string | Blob,
      filename: string,
      init?: Omit<RequestInit, "signal">,
    ) => {
      cancel();
      const id = sequence.current;
      const abort = new AbortController();
      controller.current = abort;
      setLoading(true);
      setError(undefined);
      try {
        let blob: Blob;
        if (typeof input === "string") {
          const response = await fetch(input, {
            ...init,
            signal: abort.signal,
          });
          if (!response.ok)
            throw new Error(`Download failed: HTTP ${response.status}`);
          blob = await response.blob();
        } else blob = input;
        if (id !== sequence.current || !mounted.current) throw abortError();
        save(blob, filename);
        setLoading(false);
        return blob;
      } catch (reason) {
        if (id === sequence.current && mounted.current) {
          setLoading(false);
          setError(reason);
        }
        throw reason;
      }
    },
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      sequence.current++;
      controller.current?.abort();
      urls.current.forEach((timer, url) => {
        clearTimeout(timer);
        URL.revokeObjectURL(url);
      });
      urls.current.clear();
    };
  }, []);
  return { download, loading, error, cancel };
}
