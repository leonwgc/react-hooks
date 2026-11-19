import { Scenario } from "./Scenario";
import Case1 from "./useInfiniteScroll/Case1";
import Case1Source from "./useInfiniteScroll/Case1.tsx?raw";
import Case2 from "./useInfiniteScroll/Case2";
import Case2Source from "./useInfiniteScroll/Case2.tsx?raw";
import Feature1 from "./useInfiniteScroll/Feature1";
import Feature1Source from "./useInfiniteScroll/Feature1.tsx?raw";
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
      <Scenario
        source={Feature1Source}
        title="以 null 作为首页游标"
        description="首页请求不带游标，initialCursor 为 null；之后使用服务端返回的令牌，nextCursor 为 null 时结束。"
      >
        <Feature1 />
      </Scenario>
    </div>
  );
}
