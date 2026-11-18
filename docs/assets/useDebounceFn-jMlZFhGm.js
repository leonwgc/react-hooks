import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./effects-C4A-CUJd.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(``),[n,i]=a.useState(`未保存`),s=r(e=>i(e||`空草稿`),600);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`自动保存草稿`,(0,o.jsx)(`input`,{value:e,onChange:e=>{t(e.target.value),s.run(e.target.value)}})]}),(0,o.jsx)(`button`,{onClick:()=>s.flush(),children:`立即保存草稿`}),(0,o.jsx)(`button`,{onClick:s.cancel,children:`取消待保存`}),(0,o.jsxs)(`output`,{children:[`已保存：`,n]})]})}var c=`import * as React from "react";

import { useDebounceFn } from "../../../src";

function Case1() {
  const [text, setText] = React.useState("");
  const [saved, setSaved] = React.useState("未保存");
  const save = useDebounceFn(
    (value: string) => setSaved(value || "空草稿"),
    600,
  );
  return (
    <>
      <label>
        自动保存草稿
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            save.run(e.target.value);
          }}
        />
      </label>
      <button onClick={() => save.flush()}>立即保存草稿</button>
      <button onClick={save.cancel}>取消待保存</button>
      <output>已保存：{saved}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`无`),n=r(e=>(t(e),e),800);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>{n.run(`A`),n.run(`B`),n.run(`C`)},children:`连续提交 A / B / C`}),(0,o.jsx)(`button`,{onClick:()=>n.flush(),children:`立即处理最后一项`}),(0,o.jsx)(`button`,{onClick:n.cancel,children:`撤销待处理项`}),(0,o.jsxs)(`output`,{children:[`处理结果：`,e]})]})}var u=`import * as React from "react";

import { useDebounceFn } from "../../../src";

function Case2() {
  const [result, setResult] = React.useState("无");
  const action = useDebounceFn((value: string) => {
    setResult(value);
    return value;
  }, 800);
  return (
    <>
      <button
        onClick={() => {
          action.run("A");
          action.run("B");
          action.run("C");
        }}
      >
        连续提交 A / B / C
      </button>
      <button onClick={() => action.flush()}>立即处理最后一项</button>
      <button onClick={action.cancel}>撤销待处理项</button>
      <output>处理结果：{result}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`草稿自动保存`,description:`输入持续重启等待，手动保存调用 flush，撤销待保存调用 cancel。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`只保留最后一组参数`,description:`依次传入 A、B、C；等待结束或立即执行只会处理最后一次参数。`,children:(0,o.jsx)(l,{})})]})}export{d as default};