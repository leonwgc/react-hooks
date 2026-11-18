var e=`import * as React from "react";
import { usePermission } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [role, setRole] = React.useState("访客");
  const p = usePermission(
    role === "管理员" ? ["read", "write"] : role === "编辑" ? ["read"] : [],
  );
  return (
    <>
      <label>
        演示角色
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>访客</option>
          <option>编辑</option>
          <option>管理员</option>
        </select>
      </label>
      <output>
        查看入口：{p.hasAny(["read", "write"]) ? "允许" : "拒绝"}；发布入口：
        {p.hasAll(["read", "write"]) ? "允许" : "拒绝"}
      </output>
    </>
  );
}
function Case2() {
  const [allowed, setAllowed] = React.useState<string[]>([]);
  const p = usePermission(allowed);
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button onClick={() => setAllowed(["export"])}>授予导出权限</button>
      <button onClick={() => setAllowed([])}>撤销导出权限</button>
      <button
        disabled={!p.has("export")}
        onClick={() => setCount((n) => n + 1)}
      >
        执行演示导出
      </button>
      <output>已导出 {count} 次</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="全部权限与任一权限"
        description="切换角色，分别观察需要全部权限和任一权限的功能。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="动态授权与撤销"
        description="替换权限集合后，按钮状态立即更新。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};