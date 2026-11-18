import { useInfiniteScroll } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const feed = useInfiniteScroll(
    async ({ cursor, signal }) => {
      await delay(signal, 200);
      return {
        items: [
          { id: cursor, text: `历史 ${cursor}` },
          { id: 99, text: "共享消息" },
        ],
        nextCursor: cursor > 1 ? cursor - 1 : null,
      };
    },
    {
      initialCursor: 3,
      manual: true,
      direction: "prepend",
      getKey: (item) => item.id,
    },
  );
  return (
    <>
      <button
        disabled={feed.loading || !feed.hasMore}
        onClick={() => void feed.loadMore().catch(() => {})}
      >
        加载更早历史
      </button>
      <button onClick={feed.cancel}>取消历史请求</button>
      <ol>
        {feed.items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
      <output>去重后 {feed.items.length} 条</output>
    </>
  );
}

export default Case2;
