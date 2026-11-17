import { useEffect, useRef, useState } from "react";
import { useMemoizedFn } from "../state/index.js";
import { useMediaQuery } from "../browser/index.js";
import { resolveTarget, type Target } from "../internal/utils.js";

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
export function useRafLoop(
  callback: (frame: { time: number; delta: number }) => void,
  autoStart = true,
) {
  const [running, setRunning] = useState(false);
  const frame = useRef<number | null>(null);
  const active = useRef(false);
  const previous = useRef<number | null>(null);
  const invoke = useMemoizedFn(callback);
  const tick = useMemoizedFn((time: number) => {
    if (!active.current) return;
    const delta = previous.current === null ? 0 : time - previous.current;
    previous.current = time;
    try {
      invoke({ time, delta });
    } catch (error) {
      active.current = false;
      setRunning(false);
      throw error;
    }
    if (active.current) frame.current = requestAnimationFrame(tick);
  });
  const stop = useMemoizedFn(() => {
    active.current = false;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    previous.current = null;
    setRunning(false);
  });
  const start = useMemoizedFn(() => {
    if (active.current || typeof requestAnimationFrame === "undefined") return;
    active.current = true;
    previous.current = null;
    setRunning(true);
    frame.current = requestAnimationFrame(tick);
  });
  useEffect(() => {
    if (autoStart) start();
    else stop();
    return () => {
      active.current = false;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      previous.current = null;
    };
  }, [autoStart, start, stop]);
  return { running, start, stop };
}
export function useAnimate(
  target: Target<Element>,
  options: { respectReducedMotion?: boolean } = {},
) {
  const [status, setStatus] = useState<
    "idle" | "running" | "paused" | "finished"
  >("idle");
  const animation = useRef<Animation | null>(null);
  const reduced = useReducedMotion();
  const cancel = useMemoizedFn(() => {
    if (animation.current) {
      animation.current.onfinish = null;
      animation.current.oncancel = null;
      animation.current.cancel();
      animation.current = null;
    }
    setStatus("idle");
  });
  const play = useMemoizedFn(
    (
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      timing: number | KeyframeAnimationOptions = 300,
    ): Animation | null => {
      cancel();
      const node = resolveTarget(target);
      if (!node || typeof node.animate !== "function") return null;
      const settings =
        typeof timing === "number" ? { duration: timing } : timing;
      const next = node.animate(
        keyframes,
        reduced && options.respectReducedMotion !== false
          ? { ...settings, duration: 0, delay: 0, iterations: 1 }
          : settings,
      );
      animation.current = next;
      setStatus("running");
      next.onfinish = () => {
        if (animation.current === next) setStatus("finished");
      };
      next.oncancel = () => {
        if (animation.current === next) setStatus("idle");
      };
      return next;
    },
  );
  const pause = useMemoizedFn(() => {
    if (animation.current) {
      animation.current.pause();
      setStatus("paused");
    }
  });
  const resume = useMemoizedFn(() => {
    if (animation.current) {
      animation.current.play();
      setStatus("running");
    }
  });
  const reverse = useMemoizedFn(() => {
    if (animation.current) {
      animation.current.reverse();
      setStatus("running");
    }
  });
  useEffect(() => {
    if (
      reduced &&
      options.respectReducedMotion !== false &&
      animation.current
    ) {
      animation.current.effect?.updateTiming({
        duration: 0,
        delay: 0,
        iterations: 1,
      });
      animation.current.finish();
    }
  }, [reduced, options.respectReducedMotion]);
  useEffect(
    () => () => {
      if (animation.current) {
        animation.current.onfinish = null;
        animation.current.oncancel = null;
        animation.current.cancel();
        animation.current = null;
      }
    },
    [],
  );
  return { status, play, pause, resume, reverse, cancel };
}
