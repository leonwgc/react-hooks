import * as React from "react";
import { useInfiniteScroll } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="字符串游标与手动加载"
        description="使用字符串令牌作为 Cursor，手动逐页加载，null 表示已到末尾。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="前插历史与重复项去重"
        description="每页含一个重复记录，按 id 去重，并把旧消息插入前方。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
