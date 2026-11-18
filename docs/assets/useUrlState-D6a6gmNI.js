import{t as e}from"./Scenario-B54Ff5d8.js";import{D as t,m as n}from"./index-DcZxIQAI.js";var r=t();function i(){let[e,t]=n({exampleCategory:`全部`,examplePage:`1`});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>t({exampleCategory:`教程`,examplePage:`2`}),children:`设置教程第 2 页`}),(0,r.jsx)(`button`,{onClick:()=>t({exampleCategory:null,examplePage:null}),children:`清除演示参数`}),(0,r.jsxs)(`output`,{children:[e.exampleCategory??`默认分类`,` / `,e.examplePage??`默认页`]})]})}var a=`import { useUrlState } from "../../../src";

function Case1() {
  const [state, set] = useUrlState({
    exampleCategory: "全部",
    examplePage: "1",
  });
  return (
    <>
      <button
        onClick={() => set({ exampleCategory: "教程", examplePage: "2" })}
      >
        设置教程第 2 页
      </button>
      <button onClick={() => set({ exampleCategory: null, examplePage: null })}>
        清除演示参数
      </button>
      <output>
        {state.exampleCategory ?? "默认分类"} / {state.examplePage ?? "默认页"}
      </output>
    </>
  );
}

export default Case1;
`;function o(){let[e,t]=n({exampleTab:`简介`},`push`);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>t({exampleTab:`详情`}),children:`进入详情并记录历史`}),(0,r.jsx)(`button`,{onClick:()=>t({exampleTab:`评论`}),children:`进入评论并记录历史`}),(0,r.jsxs)(`output`,{children:[`URL 页签：`,e.exampleTab]}),(0,r.jsx)(`p`,{children:`请使用浏览器后退键观察恢复；其他演示参数保持不变。`})]})}var s=`import { useUrlState } from "../../../src";

function Case2() {
  const [state, set] = useUrlState({ exampleTab: "简介" }, "push");
  return (
    <>
      <button onClick={() => set({ exampleTab: "详情" })}>
        进入详情并记录历史
      </button>
      <button onClick={() => set({ exampleTab: "评论" })}>
        进入评论并记录历史
      </button>
      <output>URL 页签：{state.exampleTab}</output>
      <p>请使用浏览器后退键观察恢复；其他演示参数保持不变。</p>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`多条件同步与删除`,description:`使用独立演示参数，批量写入并单独删除，保留其他查询参数与 hash 路由。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`浏览器前进与后退`,description:`push 为每次选择新增历史，可用浏览器后退恢复上一次 URL 状态。`,children:(0,r.jsx)(o,{})})]})}export{c as default};