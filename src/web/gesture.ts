import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useMemoizedFn } from "../state/index.js";
export type GestureDirection = "left" | "right" | "up" | "down";
export interface GestureState {
  active: boolean;
  dragging: boolean;
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: GestureDirection | null;
  swipe: GestureDirection | null;
}
export interface GestureOptions {
  axis?: "both" | "x" | "y";
  threshold?: number;
  swipeDistance?: number;
  disabled?: boolean;
  onStart?: (state: GestureState) => void;
  onMove?: (state: GestureState) => void;
  onEnd?: (state: GestureState) => void;
  onCancel?: (state: GestureState) => void;
}
const empty = (): GestureState => ({
  active: false,
  dragging: false,
  offset: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  direction: null,
  swipe: null,
});
export function useGesture(options: GestureOptions = {}) {
  const [state, setState] = useState<GestureState>(empty);
  const current = useRef(state);
  const pointer = useRef<{
    id: number;
    node: HTMLElement;
    startX: number;
    startY: number;
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const publish = (next: GestureState) => {
    current.current = next;
    setState(next);
    return next;
  };
  const release = () => {
    const active = pointer.current;
    pointer.current = null;
    if (active?.node.hasPointerCapture?.(active.id))
      active.node.releasePointerCapture(active.id);
  };
  const cancel = useMemoizedFn(() => {
    if (!pointer.current) return;
    release();
    const next = publish({
      ...current.current,
      active: false,
      dragging: false,
      swipe: null,
    });
    options.onCancel?.(next);
  });
  const reset = useMemoizedFn(() => {
    cancel();
    publish(empty());
  });
  const onPointerDown = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    if (
      options.disabled ||
      pointer.current ||
      event.isPrimary === false ||
      event.button !== 0
    )
      return;
    pointer.current = {
      id: event.pointerId,
      node: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      /* A detached target may not allow capture. */
    }
    const next = publish({ ...empty(), active: true });
    options.onStart?.(next);
  });
  const sample = (event: PointerEvent<HTMLElement>, ending = false) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return null;
    const axis = options.axis ?? "both";
    const x = axis === "y" ? 0 : event.clientX - p.startX,
      y = axis === "x" ? 0 : event.clientY - p.startY;
    const dt = Math.max(1, event.timeStamp - p.time);
    const moved = event.clientX !== p.x || event.clientY !== p.y;
    const velocity =
      ending && !moved && dt < 80
        ? current.current.velocity
        : {
            x: axis === "y" ? 0 : (event.clientX - p.x) / dt,
            y: axis === "x" ? 0 : (event.clientY - p.y) / dt,
          };
    p.x = event.clientX;
    p.y = event.clientY;
    p.time = event.timeStamp;
    const distance = Math.hypot(x, y);
    const direction: GestureDirection | null =
      distance === 0
        ? null
        : Math.abs(x) >= Math.abs(y)
          ? x > 0
            ? "right"
            : "left"
          : y > 0
            ? "down"
            : "up";
    const threshold = Math.max(0, options.threshold ?? 8);
    const dragging = current.current.dragging || distance >= threshold;
    return {
      active: !ending,
      dragging: !ending && dragging,
      offset: { x, y },
      velocity,
      direction,
      swipe:
        ending &&
        dragging &&
        distance >= Math.max(threshold, options.swipeDistance ?? 40)
          ? direction
          : null,
    };
  };
  const onPointerMove = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    const next = sample(event);
    if (next) {
      publish(next);
      options.onMove?.(next);
    }
  });
  const onPointerUp = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    const next = sample(event, true);
    if (next) {
      release();
      publish(next);
      options.onEnd?.(next);
    }
  });
  const onPointerCancel = useMemoizedFn((event: PointerEvent<HTMLElement>) => {
    if (pointer.current?.id === event.pointerId) cancel();
  });
  useEffect(() => {
    if (options.disabled) cancel();
  }, [options.disabled, cancel]);
  useEffect(() => {
    window.addEventListener("blur", cancel);
    return () => {
      window.removeEventListener("blur", cancel);
      release();
    };
  }, [cancel]);
  const style: CSSProperties = {
    touchAction: options.disabled
      ? undefined
      : options.axis === "x"
        ? "pan-y"
        : options.axis === "y"
          ? "pan-x"
          : "none",
  };
  return {
    ...state,
    cancel,
    reset,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
      style,
    },
  };
}
