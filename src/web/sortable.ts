import {
  useId,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type Key,
} from "react";
import { useLatest, useMemoizedFn } from "../state/index.js";

export function useSortable<T>(
  items: readonly T[],
  options: {
    getKey: (item: T) => Key;
    onChange: (items: T[]) => void;
    disabled?: boolean;
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
  const begin = useMemoizedFn((key: Key, source: "keyboard" | "drag") => {
    active.current = key;
    mode.current = source;
    original.current = current.current.map(config.current.getKey);
    setActiveKey(key);
    setAnnouncement(
      `已拾取第 ${original.current.indexOf(key) + 1} 项，可使用方向键调整位置。`,
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
    setAnnouncement(`已移动到第 ${to + 1} 项，共 ${next.length} 项。`);
    return true;
  });
  const finish = useMemoizedFn(() => {
    active.current = null;
    mode.current = null;
    original.current = [];
    setActiveKey(null);
    setAnnouncement("排序已完成。");
  });
  const cancel = useMemoizedFn(() => {
    if (mode.current === "keyboard") {
      const rank = new Map(original.current.map((key, index) => [key, index]));
      // Restore order only; preserve concurrent edits and newly inserted records.
      const next = [...current.current].sort(
        (a, b) =>
          (rank.get(config.current.getKey(a)) ?? Infinity) -
          (rank.get(config.current.getKey(b)) ?? Infinity),
      );
      current.current = next;
      config.current.onChange(next);
    }
    active.current = null;
    mode.current = null;
    original.current = [];
    setActiveKey(null);
    setAnnouncement("已取消排序。");
  });
  useEffect(() => {
    if (options.disabled && active.current !== null) cancel();
  }, [options.disabled, cancel]);
  const getItemProps = (item: T) => {
    const key = options.getKey(item);
    return {
      draggable: !options.disabled,
      tabIndex: options.disabled ? -1 : 0,
      "aria-roledescription": "可排序项目",
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
