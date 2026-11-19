import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./steps-CJUIEz94.js";import{t as i}from"./webHelpers-C9HRgI6m.js";import{D as a}from"./index-BH-UjxLV.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(!1),n=r({count:3,validate:async({signal:t})=>(await i(t,700),e)});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`改为校验失败`:`改为校验通过`}),(0,s.jsx)(`button`,{onClick:()=>void n.next(),children:`校验后进入下一步`}),(0,s.jsx)(`button`,{onClick:n.cancel,children:`取消步骤校验`}),(0,s.jsxs)(`output`,{children:[`步骤 `,n.step+1,` · `,n.validating?`校验中`:`等待操作`]})]})}var l=`import * as React from "react";

import { useSteps } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [allow, setAllow] = React.useState(false);
  const s = useSteps({
    count: 3,
    validate: async ({ signal }) => {
      await delay(signal, 700);
      return allow;
    },
  });
  return (
    <>
      <button onClick={() => setAllow((v) => !v)}>
        {allow ? "改为校验失败" : "改为校验通过"}
      </button>
      <button onClick={() => void s.next()}>校验后进入下一步</button>
      <button onClick={s.cancel}>取消步骤校验</button>
      <output>
        步骤 {s.step + 1} · {s.validating ? "校验中" : "等待操作"}
      </output>
    </>
  );
}

export default Case1;
`;function u(){let[e,t]=o.useState(5),n=r({count:e});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>void n.goTo(4),children:`跳到第五步`}),(0,s.jsx)(`button`,{onClick:()=>t(2),children:`缩减为两步`}),(0,s.jsx)(`button`,{onClick:()=>n.reset(),children:`回到流程起点`}),(0,s.jsxs)(`output`,{children:[`步骤 `,n.step+1,` / `,n.count,` · 完成 `,n.completed.join(`,`)||`无`]})]})}var d=`import * as React from "react";

import { useSteps } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(5);
  const s = useSteps({ count });
  return (
    <>
      <button onClick={() => void s.goTo(4)}>跳到第五步</button>
      <button onClick={() => setCount(2)}>缩减为两步</button>
      <button onClick={() => s.reset()}>回到流程起点</button>
      <output>
        步骤 {s.step + 1} / {s.count} · 完成 {s.completed.join(",") || "无"}
      </output>
    </>
  );
}

export default Case2;
`;function f(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`异步校验与取消`,description:`等待模拟校验时可取消；取消后即使旧服务结束，也不会跳到下一步。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`步骤数量与跳转边界`,description:`指定索引跳转，减少总步骤数后当前索引会限制到有效范围。`,children:(0,s.jsx)(u,{})})]})}export{f as default};