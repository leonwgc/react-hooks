import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{i as r}from"./interaction-D-ABlDu0.js";import{D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(!1),[n,i]=a.useState(`等待导航`),s=r(!0,{confirm:()=>e});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`改为拒绝离开`:`改为允许离开`}),(0,o.jsx)(`button`,{onClick:()=>void s.guard(()=>i(`已执行导航`)).then(e=>{e||i(`已保留编辑`)}),children:`尝试页内导航`}),(0,o.jsx)(`output`,{children:n})]})}var c=`import * as React from "react";

import { useLeaveConfirm } from "../../../src";

function Case1() {
  const [allow, setAllow] = React.useState(false);
  const [result, setResult] = React.useState("等待导航");
  const leave = useLeaveConfirm(true, { confirm: () => allow });
  return (
    <>
      <button onClick={() => setAllow((v) => !v)}>
        {allow ? "改为拒绝离开" : "改为允许离开"}
      </button>
      <button
        onClick={() =>
          void leave
            .guard(() => setResult("已执行导航"))
            .then((ok) => {
              if (!ok) setResult("已保留编辑");
            })
        }
      >
        尝试页内导航
      </button>
      <output>{result}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(!1),[n,i]=a.useState(`尚未离开`),s=r(e,{confirm:async()=>(await new Promise(e=>setTimeout(e,300)),!1)});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(!0),children:`产生修改`}),(0,o.jsx)(`button`,{onClick:()=>t(!1),children:`保存修改`}),(0,o.jsx)(`button`,{onClick:()=>void s.confirmLeave().then(e=>i(e?`可以离开`:`需要先保存`)),children:`检查能否离开`}),(0,o.jsxs)(`output`,{children:[e?`未保存`:`已保存`,` · `,n]})]})}var u=`import * as React from "react";

import { useLeaveConfirm } from "../../../src";

function Case2() {
  const [dirty, setDirty] = React.useState(false);
  const [result, setResult] = React.useState("尚未离开");
  const leave = useLeaveConfirm(dirty, {
    confirm: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return false;
    },
  });
  return (
    <>
      <button onClick={() => setDirty(true)}>产生修改</button>
      <button onClick={() => setDirty(false)}>保存修改</button>
      <button
        onClick={() =>
          void leave
            .confirmLeave()
            .then((ok) => setResult(ok ? "可以离开" : "需要先保存"))
        }
      >
        检查能否离开
      </button>
      <output>
        {dirty ? "未保存" : "已保存"} · {result}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`自定义确认与取消`,description:`以页内选择代替浏览器弹窗，分别体验允许离开和继续编辑。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`保存后无需确认`,description:`dirty 为 false 时跳过确认；修改后恢复保护，异步确认完成才执行导航。`,children:(0,o.jsx)(l,{})})]})}export{d as default};