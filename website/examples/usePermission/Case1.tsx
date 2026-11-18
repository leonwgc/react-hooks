import * as React from "react";

import { usePermission } from "../../../src";

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

export default Case1;
