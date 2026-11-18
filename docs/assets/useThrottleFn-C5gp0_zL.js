import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{i as r}from"./effects-C4A-CUJd.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(0),[n,i]=a.useState(0),s=r(e=>i(e),500);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`拖动预览值`,(0,o.jsx)(`input`,{type:`range`,min:0,max:100,value:e,onChange:e=>{let n=Number(e.target.value);t(n),s.run(n)}})]}),(0,o.jsxs)(`output`,{children:[`即时 `,e,` · 已处理 `,n]}),(0,o.jsx)(`button`,{onClick:()=>s.flush(),children:`立即同步尾沿`})]})}var c=`import * as React from "react";

import { useThrottleFn } from "../../../src";

function Case1() {
  const [value, setValue] = React.useState(0);
  const [processed, setProcessed] = React.useState(0);
  const action = useThrottleFn((n: number) => setProcessed(n), 500);
  return (
    <>
      <label>
        拖动预览值
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            setValue(n);
            action.run(n);
          }}
        />
      </label>
      <output>
        即时 {value} · 已处理 {processed}
      </output>
      <button onClick={() => action.flush()}>立即同步尾沿</button>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState([]),n=r(e=>t(t=>[...t,e]),1e3);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>{n.run(`首条`),n.run(`尾条`)},children:`连续提交两条`}),(0,o.jsx)(`button`,{onClick:n.cancel,children:`取消尾条`}),(0,o.jsx)(`button`,{onClick:()=>n.run(`新窗口`),children:`提交新窗口`}),(0,o.jsx)(`output`,{children:e.join(` → `)||`尚未执行`})]})}var u=`import * as React from "react";

import { useThrottleFn } from "../../../src";

function Case2() {
  const [events, setEvents] = React.useState<string[]>([]);
  const action = useThrottleFn(
    (value: string) => setEvents((s) => [...s, value]),
    1000,
  );
  return (
    <>
      <button
        onClick={() => {
          action.run("首条");
          action.run("尾条");
        }}
      >
        连续提交两条
      </button>
      <button onClick={action.cancel}>取消尾条</button>
      <button onClick={() => action.run("新窗口")}>提交新窗口</button>
      <output>{events.join(" → ") || "尚未执行"}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`拖动数值预览`,description:`滑块立即更新，节流处理值最多按固定间隔发布，并保留最后的数值。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`取消与重新开始`,description:`连续提交会保留尾沿；cancel 清除尾沿并重置执行窗口。`,children:(0,o.jsx)(l,{})})]})}export{d as default};