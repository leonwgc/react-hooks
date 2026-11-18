import { Scenario } from "./Scenario";
import Case1 from "./useDocumentTitle/Case1";
import Case1Source from "./useDocumentTitle/Case1.tsx?raw";
import Case2 from "./useDocumentTitle/Case2";
import Case2Source from "./useDocumentTitle/Case2.tsx?raw";
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        source={Case1Source}
        title="未读消息标题"
        description="改变未读数量，实时将数量反映到浏览器标题中。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        source={Case2Source}
        title="临时标题与卸载恢复"
        description="显示临时子组件后，它接管标题；关闭子组件恢复当前场景标题。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
