import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const feed = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: [cursor === "start" ? "第一页内容" : "第二页内容"],
        nextCursor: cursor === "start" ? "next" : null,
      };
    },
    { initialCursor: "start", manual: true },
  );
  return (
    <>
      <button
        disabled={feed.loading || !feed.hasMore}
        onClick={() => void feed.loadMore().catch(() => {})}
      >
        加载字符串游标下一页
      </button>
      <button onClick={feed.reset}>重置游标</button>
      <output>
        {feed.items.join(" / ") || "等待加载"} ·{" "}
        {feed.hasMore ? "还有下一页" : "已到末尾"}
      </output>
    </>
  );
}

export default Case1;
