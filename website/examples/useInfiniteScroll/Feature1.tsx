import * as React from "react";

import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

// The first request has no cursor, so the cursor type includes null.
const pages: Record<string, { items: string[]; nextCursor: string | null }> = {
  first: { items: ["最新 1", "最新 2"], nextCursor: "token-a" },
  "token-a": { items: ["较早 3", "较早 4"], nextCursor: "token-b" },
  "token-b": { items: ["最早 5"], nextCursor: null },
};

function Feature1() {
  const [cursors, setCursors] = React.useState<string[]>([]);
  const feed = useInfiniteScroll<string, string | null>(
    async ({ signal, cursor }) => {
      setCursors((list) => [...list, cursor ?? "null"]);
      await delay(signal, 200);
      return pages[cursor ?? "first"]!;
    },
    { initialCursor: null },
  );
  return (
    <>
      <button
        disabled={!feed.hasMore || feed.loading}
        onClick={() => void feed.loadMore()}
      >
        {feed.hasMore ? "加载下一页" : "已全部加载"}
      </button>
      <button className="secondary" onClick={feed.reset}>
        重新加载
      </button>
      <ul>
        {feed.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <output>请求游标：{cursors.join(" → ") || "无"}</output>
    </>
  );
}

export default Feature1;
