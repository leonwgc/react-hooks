import { useMemo } from "react";
import { useVirtualList, useInfiniteScroll } from "../../src";
import { delay } from "./webHelpers";
const records = Array.from({ length: 10000 }, (_, id) => ({
  id,
  title: `记录 ${id + 1}`,
}));
export default function Demo() {
  const list = useVirtualList(records, {
    itemHeight: 36,
    height: 220,
    getKey: (item) => item.id,
  });
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <button onClick={() => list.scrollTo(4999, "center")}>
          定位第 5000 项
        </button>
        <output>10000 项 / 当前渲染 {list.virtualItems.length} 项</output>
      </div>
      <div
        ref={list.containerRef}
        onScroll={list.onScroll}
        style={list.containerStyle}
        role="list"
        aria-label="虚拟记录列表"
        tabIndex={0}
      >
        <div style={{ height: list.totalHeight, position: "relative" }}>
          {list.virtualItems.map((row) => (
            <div
              key={row.key}
              style={row.style}
              role="listitem"
              aria-posinset={row.index + 1}
              aria-setsize={records.length}
            >
              {row.item.title}
            </div>
          ))}
        </div>
      </div>
      <DynamicFeed />
    </div>
  );
}

const initialMessages = Array.from({ length: 20 }, (_, id) => ({
  id,
  text: `消息 ${id}：${"不同长度的内容，用于展示动态高度。".repeat((id % 3) + 1)}`,
}));
function DynamicFeed() {
  const previous = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: cursor * 10 + i,
          text: `历史消息 ${cursor * 10 + i}：${"较长内容。".repeat((i % 4) + 1)}`,
        })),
        nextCursor: cursor > -3 ? cursor - 1 : null,
      };
    },
    {
      initialCursor: -1,
      manual: true,
      direction: "prepend",
      getKey: (item) => item.id,
    },
  );
  const next = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: cursor * 10 + i,
          text: `后续消息 ${cursor * 10 + i}：${"新消息内容。".repeat((i % 4) + 1)}`,
        })),
        nextCursor: cursor < 4 ? cursor + 1 : null,
      };
    },
    { initialCursor: 2, manual: true, getKey: (item) => item.id },
  );
  const items = useMemo(
    () => [...previous.items, ...initialMessages, ...next.items],
    [previous.items, next.items],
  );
  const list = useVirtualList(items, {
    height: 240,
    itemHeight: 64,
    dynamic: true,
    getKey: (item) => item.id,
    onStartReached: () => {
      if (previous.hasMore && !previous.error) void previous.loadMore();
    },
    onEndReached: () => {
      if (next.hasMore && !next.error) void next.loadMore();
    },
  });
  return (
    <section className="demo-stack">
      <h3>动态高度与双向加载</h3>
      <div className="demo-row">
        <button
          disabled={previous.loading || !previous.hasMore}
          onClick={() => void previous.loadMore()}
        >
          加载更早消息
        </button>
        <button
          disabled={next.loading || !next.hasMore}
          onClick={() => void next.loadMore()}
        >
          加载后续消息
        </button>
      </div>
      <div
        ref={list.containerRef}
        onScroll={list.onScroll}
        style={list.containerStyle}
        role="list"
        aria-label="动态消息列表"
        tabIndex={0}
      >
        <div style={{ height: list.totalHeight, position: "relative" }}>
          {list.virtualItems.map((row) => (
            <div
              key={row.key}
              ref={row.measureRef}
              style={{
                ...row.style,
                padding: "12px 8px",
                borderBottom: "1px solid var(--line)",
              }}
              role="listitem"
            >
              {row.item.text}
            </div>
          ))}
        </div>
      </div>
      <small>
        ResizeObserver 测量行高；在上方插入消息时保留当前阅读位置。当前{" "}
        {items.length} 条消息。
      </small>
    </section>
  );
}
