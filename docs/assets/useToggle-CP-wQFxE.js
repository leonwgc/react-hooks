import{t as e}from"./Scenario-B54Ff5d8.js";import{D as t,T as n}from"./index-DcZxIQAI.js";import{r,t as i}from"./react-DvXU6kJ2.js";var a=t();function o(){let e=n(100,150);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:e.toggle,children:`切换缩放`}),(0,a.jsx)(`button`,{onClick:()=>e.setValue(100),children:`恢复 100%`}),(0,a.jsxs)(`output`,{children:[`缩放：`,e.value,`%`]}),(0,a.jsx)(`p`,{style:{fontSize:e.value/100+`em`},children:`可缩放的预览文字`})]})}var s=`import { useToggle } from "../../../src";

function Case1() {
  const zoom = useToggle(100, 150);
  return (
    <>
      <button onClick={zoom.toggle}>切换缩放</button>
      <button onClick={() => zoom.setValue(100)}>恢复 100%</button>
      <output>缩放：{zoom.value}%</output>
      <p style={{ fontSize: zoom.value / 100 + "em" }}>可缩放的预览文字</p>
    </>
  );
}

export default Case1;
`,c=r(i(),1);function l(){let[e]=c.useState({name:`简洁`,columns:1}),[t]=c.useState({name:`丰富`,columns:3}),r=n(e,t);return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:r.toggle,children:`切换预设`}),(0,a.jsx)(`button`,{onClick:()=>r.setValue({name:`自定义`,columns:2}),children:`设置自定义预设`}),(0,a.jsxs)(`output`,{children:[r.value.name,` · `,r.value.columns,` 列`]})]})}var u=`import * as React from "react";

import { useToggle } from "../../../src";

function Case2() {
  const [first] = React.useState({ name: "简洁", columns: 1 });
  const [second] = React.useState({ name: "丰富", columns: 3 });
  const state = useToggle(first, second);
  return (
    <>
      <button onClick={state.toggle}>切换预设</button>
      <button onClick={() => state.setValue({ name: "自定义", columns: 2 })}>
        设置自定义预设
      </button>
      <output>
        {state.value.name} · {state.value.columns} 列
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`数字缩放档位`,description:`在 100% 和 150% 两个数字值之间切换，也可以直接指定一个档位。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:u,title:`对象预设与自定义值`,description:`对象按引用比较；手动设置第三个值后再次切换会回到第一个预设。`,children:(0,a.jsx)(l,{})})]})}export{d as default};