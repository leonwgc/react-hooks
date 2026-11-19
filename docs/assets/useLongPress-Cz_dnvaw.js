import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{a as r}from"./interaction-Dc8gA3a8.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(!1),[n,i]=a.useState(300),[s,c]=a.useState(0),l=()=>c(e=>e+1),u=r(l,{delay:n,disabled:e});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`长按毫秒`,(0,o.jsxs)(`select`,{value:n,onChange:e=>i(Number(e.target.value)),children:[(0,o.jsx)(`option`,{children:`300`}),(0,o.jsx)(`option`,{children:`1000`})]})]}),(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`启用长按`:`禁用长按`}),(0,o.jsx)(`button`,{...u.bind,disabled:e,children:`按住执行`}),(0,o.jsx)(`button`,{disabled:e,onClick:l,children:`键盘执行一次`}),(0,o.jsxs)(`output`,{children:[`执行 `,s,` 次`]})]})}var c=`import * as React from "react";

import { useLongPress } from "../../../src";

function Case1() {
  const [disabled, setDisabled] = React.useState(false);
  const [delay, setDelay] = React.useState(300);
  const [count, setCount] = React.useState(0);
  const act = () => setCount((n) => n + 1);
  const p = useLongPress(act, { delay, disabled });
  return (
    <>
      <label>
        长按毫秒
        <select
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        >
          <option>300</option>
          <option>1000</option>
        </select>
      </label>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用长按" : "禁用长按"}
      </button>
      <button {...p.bind} disabled={disabled}>
        按住执行
      </button>
      <button disabled={disabled} onClick={act}>
        键盘执行一次
      </button>
      <output>执行 {count} 次</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(0),n=r(()=>t(e=>e+1),{delay:900,threshold:4});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{...n.bind,style:{touchAction:`none`},children:`按住此处，移动后取消`}),(0,o.jsx)(`button`,{onClick:n.cancel,children:`取消长按等待`}),(0,o.jsx)(`button`,{onClick:()=>t(e=>e+1),children:`键盘等价触发`}),(0,o.jsxs)(`output`,{children:[n.pressing?`识别中`:`未按住`,` · `,e,` 次`]})]})}var u=`import * as React from "react";

import { useLongPress } from "../../../src";

function Case2() {
  const [count, setCount] = React.useState(0);
  const p = useLongPress(() => setCount((n) => n + 1), {
    delay: 900,
    threshold: 4,
  });
  return (
    <>
      <button {...p.bind} style={{ touchAction: "none" }}>
        按住此处，移动后取消
      </button>
      <button onClick={p.cancel}>取消长按等待</button>
      <button onClick={() => setCount((n) => n + 1)}>键盘等价触发</button>
      <output>
        {p.pressing ? "识别中" : "未按住"} · {count} 次
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`自定义时长与禁用`,description:`改变识别时长或禁用长按；键盘按钮调用同一个业务动作。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`移动阈值与主动取消`,description:`按住后移动超过 4px 会取消；取消按钮也可结束等待。`,children:(0,o.jsx)(l,{})})]})}export{d as default};