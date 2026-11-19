import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{a as r}from"./interaction-Cq61H0dC.js";import{D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(`访客`),n=r(e===`管理员`?[`read`,`write`]:e===`编辑`?[`read`]:[]);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`演示角色`,(0,o.jsxs)(`select`,{value:e,onChange:e=>t(e.target.value),children:[(0,o.jsx)(`option`,{children:`访客`}),(0,o.jsx)(`option`,{children:`编辑`}),(0,o.jsx)(`option`,{children:`管理员`})]})]}),(0,o.jsxs)(`output`,{children:[`查看入口：`,n.hasAny([`read`,`write`])?`允许`:`拒绝`,`；发布入口：`,n.hasAll([`read`,`write`])?`允许`:`拒绝`]})]})}var c=`import * as React from "react";

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
`;function l(){let[e,t]=a.useState([]),n=r(e),[i,s]=a.useState(0);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t([`export`]),children:`授予导出权限`}),(0,o.jsx)(`button`,{onClick:()=>t([]),children:`撤销导出权限`}),(0,o.jsx)(`button`,{disabled:!n.has(`export`),onClick:()=>s(e=>e+1),children:`执行演示导出`}),(0,o.jsxs)(`output`,{children:[`已导出 `,i,` 次`]})]})}var u=`import * as React from "react";

import { usePermission } from "../../../src";

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

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`全部权限与任一权限`,description:`切换角色，分别观察需要全部权限和任一权限的功能。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`动态授权与撤销`,description:`替换权限集合后，按钮状态立即更新。`,children:(0,o.jsx)(l,{})})]})}export{d as default};