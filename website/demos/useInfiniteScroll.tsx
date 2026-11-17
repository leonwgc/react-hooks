import { useRef, useState } from "react";
import { useInfiniteScroll, useVirtualList } from "../../src";
import { delay } from "./webHelpers";
export default function Demo() {
  const [topic, setTopic] = useState("文章");
  const [fail, setFail] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const feed = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 400);
      if (fail) throw new Error("模拟加载失败，请取消失败选项后重试。");
      return {
        items: Array.from({ length: 5 }, (_, i) => ({
          id: cursor * 5 + i,
          title: `${topic} ${cursor * 5 + i + 1}`,
        })),
        nextCursor: cursor < 3 ? cursor + 1 : null,
      };
    },
    { initialCursor: 0, resetKey: topic, getKey: (item) => item.id, sentinel },
  );
  const list = useVirtualList(feed.items, {
    itemHeight: 38,
    height: 210,
    getKey: (item) => item.id,
  });
  return (
    <div className="demo-stack">
      <label>
        内容分类
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>文章</option>
          <option>教程</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => setFail(e.target.checked)}
        />
        模拟加载失败
      </label>
      <div
        ref={list.containerRef}
        onScroll={list.onScroll}
        style={list.containerStyle}
        role="list"
        aria-label="文章流"
        tabIndex={0}
      >
        <div style={{ height: list.totalHeight + 1, position: "relative" }}>
          {list.virtualItems.map((row) => (
            <div key={row.key} style={row.style} role="listitem">
              {row.item.title}
            </div>
          ))}
          <div
            ref={sentinel}
            style={{ position: "absolute", top: list.totalHeight, height: 1 }}
          />
        </div>
      </div>
      <output>已加载 {feed.items.length} 项</output>
      {!!feed.error && <p role="alert">{String(feed.error)}</p>}
      <button
        disabled={feed.loading || !feed.hasMore}
        onClick={() => void feed.loadMore()}
      >
        {feed.loading ? "加载中…" : feed.hasMore ? "加载更多" : "已全部加载"}
      </button>
      <button onClick={feed.reset}>重置列表</button>
      <small>
        与 useVirtualList
        组合：内存模拟分页，只渲染可见记录；滚动到底部或点击按钮加载。
      </small>
    </div>
  );
}
