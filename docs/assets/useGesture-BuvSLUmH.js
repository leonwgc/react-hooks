import{t as e}from"./Scenario-qCntdwnE.js";import{t}from"./gesture-DsokL1o7.js";import{D as n}from"./index--S_n-0Gu.js";import{r,t as i}from"./react-DvXU6kJ2.js";var a=n();function o(){let e=t({axis:`y`,threshold:6});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`div`,{...e.bind,className:`pointer-pad`,"aria-label":`垂直手势区域`,children:`在区域内上下拖动`}),(0,a.jsx)(`button`,{onClick:e.cancel,children:`取消当前拖动`}),(0,a.jsx)(`button`,{onClick:e.reset,children:`清零手势位移`}),(0,a.jsxs)(`output`,{children:[`X `,Math.round(e.offset.x),` / Y `,Math.round(e.offset.y),` ·`,` `,e.dragging?`拖动中`:`未拖动`]})]})}var s=`import { useGesture } from "../../../src";

function Case1() {
  const g = useGesture({ axis: "y", threshold: 6 });
  return (
    <>
      <div {...g.bind} className="pointer-pad" aria-label="垂直手势区域">
        在区域内上下拖动
      </div>
      <button onClick={g.cancel}>取消当前拖动</button>
      <button onClick={g.reset}>清零手势位移</button>
      <output>
        X {Math.round(g.offset.x)} / Y {Math.round(g.offset.y)} ·{" "}
        {g.dragging ? "拖动中" : "未拖动"}
      </output>
    </>
  );
}

export default Case1;
`,c=r(i(),1);function l(){let[e,n]=c.useState(!1),[r,i]=c.useState(0),o=()=>i(e=>e+1),s=t({disabled:e,onEnd:e=>{e.swipe&&o()}});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`button`,{onClick:()=>n(e=>!e),children:e?`启用手势`:`禁用手势`}),(0,a.jsx)(`div`,{...s.bind,className:`pointer-pad`,"aria-label":`可禁用滑动区域`,children:`任意方向滑动超过 40px 计一次`}),(0,a.jsx)(`button`,{onClick:o,children:`键盘执行同一操作`}),(0,a.jsxs)(`output`,{children:[`业务操作 `,r,` 次 · `,e?`手势已停用`:`手势可用`]})]})}var u=`import * as React from "react";

import { useGesture } from "../../../src";

function Case2() {
  const [disabled, setDisabled] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const action = () => setCount((n) => n + 1);
  const g = useGesture({
    disabled,
    onEnd: (s) => {
      if (s.swipe) action();
    },
  });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "启用手势" : "禁用手势"}
      </button>
      <div {...g.bind} className="pointer-pad" aria-label="可禁用滑动区域">
        任意方向滑动超过 40px 计一次
      </div>
      <button onClick={action}>键盘执行同一操作</button>
      <output>
        业务操作 {count} 次 · {disabled ? "手势已停用" : "手势可用"}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,a.jsxs)(`div`,{className:`additional-demos`,children:[(0,a.jsx)(e,{source:s,title:`受限拖动轴与取消`,description:`只输出垂直位移，水平分量保持为零；取消后保留位移，重置归零。`,children:(0,a.jsx)(o,{})}),(0,a.jsx)(e,{source:u,title:`禁用手势与业务等价按钮`,description:`禁用后不再开始新手势，业务操作仍可通过键盘按钮完成。`,children:(0,a.jsx)(l,{})})]})}export{d as default};