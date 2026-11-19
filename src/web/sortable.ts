import {
  useId,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FocusEvent,
  type KeyboardEvent,
  type Key,
} from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";

export interface SortableMessages {
  roleDescription?: string;
  picked?: (position: number) => string;
  moved?: (position: number, total: number) => string;
  finished?: string;
  cancelled?: string;
}
const defaultMessages: Required<SortableMessages> = {
  roleDescription: "可排序项目",
  picked: (position) => `已拾取第 ${position} 项，可使用方向键调整位置。`,
  moved: (position, total) => `已移动到第 ${position} 项，共 ${total} 项。`,
  finished: "排序已完成。",
  cancelled: "已取消排序。",
};

export function useSortable<T>(
  items: readonly T[],
  options: {
    getKey: (item: T) => Key;
    onChange: (items: T[]) => void;
    disabled?: boolean;
    /** Screen-reader copy; defaults to Simplified Chinese. */
    messages?: SortableMessages;
  },
) {
  const id = useId();
  const current = useLatest(items);
  const config = useLatest(options);
  const [activeKey, setActiveKey] = useState<Key | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const active = useRef<Key | null>(null);
  const original = useRef<Key[]>([]);
  const mode = useRef<"keyboard" | "drag" | null>(null);
  const text = <K extends keyof SortableMessages>(name: K) =>
    (config.current.messages?.[name] ??
      defaultMessages[name]) as Required<SortableMessages>[K];
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  const begin = useMemoizedFn((key: Key, source: "keyboard" | "drag") => {
    active.current = key;
    mode.current = source;
    original.current = current.current.map(config.current.getKey);
    setActiveKey(key);
    setAnnouncement(
      text("picked")(
        original.current.indexOf(key) + 1,
      ),
    );
  });
  const move = useMemoizedFn((from: number, to: number) => {
    if (
      config.current.disabled ||
      from === to ||
      ![from, to].every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < current.current.length,
      )
    )
      return false;
    const next = [...current.current];
    next.splice(to, 0, next.splice(from, 1)[0]!);
    current.current = next;
    config.current.onChange(next);
    setAnnouncement(
      text("moved")(
        to + 1,
        next.length,
      ),
    );
    return true;
  });
  const finish = useMemoizedFn(() => {
    active.current = null;
    mode.current = null;
    original.current = [];
    setActiveKey(null);
    setAnnouncement(text("finished"));
  });
  const cancel = useMemoizedFn(() => {
    if (mode.current === "keyboard") {
      const rank = new Map(original.current.map((key, index) => [key, index]));
      // Restore order only; preserve concurrent edits and newly inserted records.
      // Unknown (newly inserted) records keep their relative order after known ones.
      const next = current.current
        .map((item, index) => ({
          item,
          rank:
            rank.get(config.current.getKey(item)) ??
            original.current.length + index,
        }))
        .sort((a, b) => a.rank - b.rank)
        .map((entry) => entry.item);
      current.current = next;
      config.current.onChange(next);
    }
    active.current = null;
    mode.current = null;
    original.current = [];
    setActiveKey(null);
    setAnnouncement(text("cancelled"));
  });
  useEffect(() => {
    if (options.disabled && active.current !== null) cancel();
  }, [options.disabled, cancel]);
  const getItemProps = (item: T) => {
    const key = options.getKey(item);
    return {
      draggable: !options.disabled,
      tabIndex: options.disabled ? -1 : 0,
      "aria-roledescription": text("roleDescription"),
      "aria-keyshortcuts": "Space ArrowUp ArrowDown Home End Enter Escape",
      "data-sorting": activeKey === key || undefined,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (
          config.current.disabled ||
          event.target !== event.currentTarget ||
          event.nativeEvent.isComposing
        )
          return;
        if (active.current === null && event.key === " ") {
          event.preventDefault();
          begin(key, "keyboard");
          return;
        }
        if (active.current !== key || mode.current !== "keyboard") return;
        if ([" ", "Enter"].includes(event.key)) {
          event.preventDefault();
          finish();
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          cancel();
          return;
        }
        const index = current.current.findIndex(
          (value) => config.current.getKey(value) === key,
        );
        const destination =
          event.key === "ArrowUp"
            ? index - 1
            : event.key === "ArrowDown"
              ? index + 1
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? current.current.length - 1
                  : null;
        if (destination !== null) {
          event.preventDefault();
          move(index, destination);
        }
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        if (active.current !== key || mode.current !== "keyboard") return;
        const node = event.currentTarget;
        // Reordering may briefly move the focused node; only cancel if focus really left.
        clearTimeout(blurTimer.current);
        blurTimer.current = setTimeout(() => {
          if (
            active.current === key &&
            mode.current === "keyboard" &&
            document.activeElement !== node
          )
            cancel();
        }, 0);
      },
      onDragStart: (event: DragEvent<HTMLElement>) => {
        if (config.current.disabled) {
          event.preventDefault();
          return;
        }
        begin(key, "drag");
        event.dataTransfer.setData("application/x-web-hooks-sortable", id);
        event.dataTransfer.effectAllowed = "move";
      },
      onDragOver: (event: DragEvent<HTMLElement>) => {
        if (
          !config.current.disabled &&
          mode.current === "drag" &&
          active.current !== null
        ) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }
      },
      onDrop: (event: DragEvent<HTMLElement>) => {
        if (
          config.current.disabled ||
          mode.current !== "drag" ||
          event.dataTransfer.getData("application/x-web-hooks-sortable") !== id
        )
          return;
        event.preventDefault();
        const from = current.current.findIndex(
          (value) => config.current.getKey(value) === active.current,
        );
        const to = current.current.findIndex(
          (value) => config.current.getKey(value) === key,
        );
        move(from, to);
        finish();
      },
      onDragEnd: () => {
        if (mode.current === "drag") finish();
      },
    };
  };
  return { activeKey, announcement, getItemProps, move, cancel };
}
