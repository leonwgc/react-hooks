import { Scenario } from "./Scenario";
import Case1 from "./useInfiniteScroll/Case1";
import Case1Source from "./useInfiniteScroll/Case1.tsx?raw";
import Case2 from "./useInfiniteScroll/Case2";
import Case2Source from "./useInfiniteScroll/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="字符串游标与手动加载"
        description="使用字符串令牌作为 Cursor，手动逐页加载，null 表示已到末尾。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="前插历史与重复项去重"
        description="每页含一个重复记录，按 id 去重，并把旧消息插入前方。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
