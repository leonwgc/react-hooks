import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,x as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(2),[n,r]=i({value:e,defaultValue:0,onChange:t});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>r(e=>Math.min(5,e+1)),children:`评分加一`}),(0,o.jsx)(`button`,{onClick:()=>t(0),children:`父级清零`}),(0,o.jsxs)(`output`,{children:[`子级 `,n,` / 父级 `,e]})]})}var c=`import * as React from "react";

import { useControllableState } from "../../../src";

function Case1() {
  const [parent, setParent] = React.useState(2);
  const [value, setValue] = useControllableState({
    value: parent,
    defaultValue: 0,
    onChange: setParent,
  });
  return (
    <>
      <button onClick={() => setValue((v) => Math.min(5, v + 1))}>
        评分加一
      </button>
      <button onClick={() => setParent(0)}>父级清零</button>
      <output>
        子级 {value} / 父级 {parent}
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(1),[n,r]=a.useState(!1),[s,c]=a.useState(1),[l,u]=i({value:e,defaultValue:0,onChange:e=>{c(e),n&&t(e)}});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>r(e=>!e),children:n?`停止回写`:`允许回写`}),(0,o.jsx)(`button`,{onClick:()=>u(e=>e+1),children:`请求加一`}),(0,o.jsxs)(`output`,{children:[`当前值 `,l,` · 最近请求 `,s]})]})}var u=`import * as React from "react";

import { useControllableState } from "../../../src";

function Case2() {
  const [parent, setParent] = React.useState(1);
  const [accept, setAccept] = React.useState(false);
  const [proposed, setProposed] = React.useState(1);
  const [value, setValue] = useControllableState({
    value: parent,
    defaultValue: 0,
    onChange: (next) => {
      setProposed(next);
      if (accept) setParent(next);
    },
  });
  return (
    <>
      <button onClick={() => setAccept((v) => !v)}>
        {accept ? "停止回写" : "允许回写"}
      </button>
      <button onClick={() => setValue((v) => v + 1)}>请求加一</button>
      <output>
        当前值 {value} · 最近请求 {proposed}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`父级控制的评分`,description:`子级提出新值，由父级 onChange 写回；父级也可以直接重置值。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`受控值需要回写`,description:`切换是否接受子组件的变更，观察回调通知和实际受控值的区别。`,children:(0,o.jsx)(l,{})})]})}export{d as default};