import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{C as r,D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(2),[n,i]=a.useState(0),s=r(t=>t*e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`倍率`,(0,o.jsx)(`input`,{type:`number`,value:e,onChange:e=>t(Number(e.target.value))})]}),(0,o.jsx)(`button`,{onClick:()=>i(s(5)),children:`计算 5 × 倍率`}),(0,o.jsxs)(`output`,{children:[`结果：`,n]})]})}var c=`import * as React from "react";

import { useMemoizedFn } from "../../../src";

function Case1() {
  const [factor, setFactor] = React.useState(2);
  const [result, setResult] = React.useState(0);
  const multiply = useMemoizedFn((n: number) => n * factor);
  return (
    <>
      <label>
        倍率
        <input
          type="number"
          value={factor}
          onChange={(e) => setFactor(Number(e.target.value))}
        />
      </label>
      <button onClick={() => setResult(multiply(5))}>计算 5 × 倍率</button>
      <output>结果：{result}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`欢迎`),[n,i]=a.useState(`等待事件`),s=a.useRef(new EventTarget),c=r(()=>i(e+`，访客`));return a.useEffect(()=>{let e=s.current;return e.addEventListener(`hello`,c),()=>e.removeEventListener(`hello`,c)},[c]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`问候前缀`,(0,o.jsx)(`input`,{value:e,onChange:e=>t(e.target.value)})]}),(0,o.jsx)(`button`,{onClick:()=>s.current.dispatchEvent(new Event(`hello`)),children:`发送问候事件`}),(0,o.jsx)(`output`,{children:n})]})}var u=`import * as React from "react";

import { useMemoizedFn } from "../../../src";

function Case2() {
  const [prefix, setPrefix] = React.useState("欢迎");
  const [log, setLog] = React.useState("等待事件");
  const bus = React.useRef(new EventTarget());
  const handler = useMemoizedFn(() => setLog(prefix + "，访客"));
  React.useEffect(() => {
    const target = bus.current;
    target.addEventListener("hello", handler);
    return () => target.removeEventListener("hello", handler);
  }, [handler]);
  return (
    <>
      <label>
        问候前缀
        <input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
      </label>
      <button onClick={() => bus.current.dispatchEvent(new Event("hello"))}>
        发送问候事件
      </button>
      <output>{log}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`参数与返回值透传`,description:`改变倍率后，稳定函数会使用最新倍率计算并返回结果。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`订阅无需重新绑定`,description:`局部事件源只绑定一次，改变前缀后事件处理函数仍使用最新文案。`,children:(0,o.jsx)(l,{})})]})}export{d as default};