import {
  useEffect,
  useRef,
  useState,
  type TransitionEvent,
  type AnimationEvent,
} from "react";
import { useMemoizedFn } from "../state/index.js";
import { useReducedMotion } from "./index.js";
export interface SpringOptions {
  initialValue?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  precision?: number;
  respectReducedMotion?: boolean;
}
export function useSpring(target: number, options: SpringOptions = {}) {
  if (!Number.isFinite(target))
    throw new RangeError("Spring target must be finite");
  const positive = (value: number | undefined, fallback: number) =>
    value !== undefined && Number.isFinite(value) && value > 0
      ? value
      : fallback;
  const stiffness = positive(options.stiffness, 170),
    damping = positive(options.damping, 26),
    mass = positive(options.mass, 1),
    precision = positive(options.precision, 0.01);
  const reduced = useReducedMotion() && options.respectReducedMotion !== false;
  const [state, setState] = useState(() => ({
    value: Number.isFinite(options.initialValue)
      ? options.initialValue!
      : target,
    velocity: 0,
    animating: false,
  }));
  const current = useRef(state);
  const frame = useRef<number | null>(null);
  const publish = (value: number, velocity: number, animating: boolean) => {
    current.current = { value, velocity, animating };
    setState(current.current);
  };
  const cancelFrame = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const stop = useMemoizedFn(() => {
    cancelFrame();
    publish(current.current.value, 0, false);
  });
  const finish = useMemoizedFn(() => {
    cancelFrame();
    publish(target, 0, false);
  });
  const restart = useMemoizedFn(() => {
    cancelFrame();
    if (reduced || typeof requestAnimationFrame === "undefined") {
      finish();
      return;
    }
    if (
      Math.abs(current.current.value - target) <= precision &&
      Math.abs(current.current.velocity) <= precision
    ) {
      finish();
      return;
    }
    publish(current.current.value, current.current.velocity, true);
    let previous: number | undefined;
    const tick = (time: number) => {
      const dt =
        previous === undefined
          ? 0
          : Math.min(0.064, Math.max(0, (time - previous) / 1000));
      previous = time;
      const x = current.current.value - target,
        v = current.current.velocity;
      const omega = Math.sqrt(stiffness / mass),
        ratio = damping / (2 * Math.sqrt(stiffness * mass));
      let displacement: number, velocity: number;
      if (Math.abs(ratio - 1) < 0.0001) {
        const decay = Math.exp(-omega * dt),
          b = v + omega * x;
        displacement = decay * (x + b * dt);
        velocity = decay * (v - omega * b * dt);
      } else if (ratio < 1) {
        const frequency = omega * Math.sqrt(1 - ratio * ratio),
          decay = Math.exp(-ratio * omega * dt);
        const cos = Math.cos(frequency * dt),
          sin = Math.sin(frequency * dt);
        displacement =
          decay * (x * cos + ((v + ratio * omega * x) / frequency) * sin);
        velocity =
          decay *
          (v * cos -
            ((ratio * omega * v + omega * omega * x) / frequency) * sin);
      } else {
        const root = Math.sqrt(damping * damping - 4 * mass * stiffness);
        const r1 = (-2 * stiffness) / (damping + root),
          r2 = (-damping - root) / (2 * mass);
        const a = (v - r2 * x) / (r1 - r2),
          b = x - a;
        displacement = a * Math.exp(r1 * dt) + b * Math.exp(r2 * dt);
        velocity = a * r1 * Math.exp(r1 * dt) + b * r2 * Math.exp(r2 * dt);
      }
      if (
        !Number.isFinite(displacement) ||
        !Number.isFinite(velocity) ||
        (Math.abs(displacement) <= precision && Math.abs(velocity) <= precision)
      ) {
        frame.current = null;
        publish(target, 0, false);
        return;
      }
      publish(target + displacement, velocity, true);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  });
  useEffect(() => {
    restart();
    return cancelFrame;
  }, [target, stiffness, damping, mass, precision, reduced, restart]);
  return { ...state, stop, finish, restart };
}
export type TransitionPhase =
  | "unmounted"
  | "preEnter"
  | "entering"
  | "entered"
  | "exiting";
export interface TransitionStateOptions {
  enterDuration?: number;
  exitDuration?: number;
  appear?: boolean;
  /**
   * Insert a "preEnter" phase (mounted with start styles) for two frames before
   * "entering", so CSS transitions on freshly mounted elements actually run.
   */
  preEnter?: boolean;
  endEvent?: "transitionend" | "animationend";
  propertyName?: string;
  animationName?: string;
  onEnter?: () => void;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
}
export function useTransitionState(
  open: boolean,
  options: TransitionStateOptions = {},
) {
  const reduced = useReducedMotion();
  const duration = (value: number | undefined) =>
    reduced ? 0 : Number.isFinite(value) ? Math.max(0, value!) : 200;
  const enter = duration(options.enterDuration),
    exit = duration(options.exitDuration);
  const [phase, setPhase] = useState<TransitionPhase>(() =>
    open
      ? options.appear
        ? options.preEnter
          ? "preEnter"
          : "entering"
        : "entered"
      : "unmounted",
  );
  const latest = useRef(phase);
  const active = useRef<{
    open: boolean;
    timer?: ReturnType<typeof setTimeout>;
    frame?: () => void;
  } | null>(null);
  const initial = useRef(true);
  const change = (next: TransitionPhase) => {
    latest.current = next;
    setPhase(next);
  };
  const complete = useMemoizedFn(() => {
    const operation = active.current;
    if (!operation || operation.open !== open) return;
    clearTimeout(operation.timer);
    operation.frame?.();
    active.current = null;
    change(open ? "entered" : "unmounted");
    if (open) options.onEntered?.();
    else options.onExited?.();
  });
  const start = useMemoizedFn(() => {
    const first = initial.current;
    initial.current = false;
    if (
      (open && latest.current === "entered") ||
      (!open && latest.current === "unmounted")
    )
      return;
    const wait = open ? enter : exit;
    const previous = latest.current;
    const next: TransitionPhase = !open
      ? "exiting"
      : options.preEnter &&
          wait > 0 &&
          (previous === "unmounted" || previous === "preEnter")
        ? "preEnter"
        : "entering";
    const enteringPhase = open
      ? (previous !== "preEnter" && previous !== "entering") || first
      : previous !== "exiting" || first;
    const operation: NonNullable<typeof active.current> = { open };
    active.current = operation;
    change(next);
    if (enteringPhase) {
      if (open) options.onEnter?.();
      else options.onExit?.();
    }
    if (wait === 0) {
      complete();
      return;
    }
    if (active.current !== operation) return;
    operation.timer = setTimeout(complete, wait);
    if (next === "preEnter") {
      // Two frames guarantee the start styles were computed before "entering" applies.
      const schedule = (callback: () => void) => {
        if (typeof requestAnimationFrame === "function") {
          const id = requestAnimationFrame(callback);
          return () => cancelAnimationFrame(id);
        }
        const id = setTimeout(callback, 16);
        return () => clearTimeout(id);
      };
      operation.frame = schedule(() => {
        operation.frame = schedule(() => {
          operation.frame = undefined;
          if (active.current === operation && latest.current === "preEnter")
            change("entering");
        });
      });
    }
  });
  useEffect(() => {
    start();
    return () => {
      clearTimeout(active.current?.timer);
      active.current?.frame?.();
      active.current = null;
    };
  }, [open, enter, exit, start]);
  const onTransitionEnd = useMemoizedFn(
    (event: TransitionEvent<HTMLElement>) => {
      if (
        (options.endEvent ?? "transitionend") !== "transitionend" ||
        event.target !== event.currentTarget ||
        (options.propertyName !== undefined &&
          event.propertyName !== options.propertyName)
      )
        return;
      complete();
    },
  );
  const onAnimationEnd = useMemoizedFn((event: AnimationEvent<HTMLElement>) => {
    if (
      options.endEvent !== "animationend" ||
      event.target !== event.currentTarget ||
      (options.animationName !== undefined &&
        event.animationName !== options.animationName)
    )
      return;
    complete();
  });
  return {
    phase,
    mounted: phase !== "unmounted",
    visible: open,
    bind: { onTransitionEnd, onAnimationEnd },
  };
}
