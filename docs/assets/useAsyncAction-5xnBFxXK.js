import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./interaction-D_XMZN7l.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let e=r(async e=>{if(await new Promise(e=>setTimeout(e,300)),e)throw Error(`演示提交失败`);return`提交成功`}),[t,n]=a.useState(`等待提交`),i=t=>{e.run(t).then(n).catch(()=>n(`请重试`))};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:e.loading,onClick:()=>i(!0),children:`提交失败请求`}),(0,o.jsx)(`button`,{disabled:e.loading,onClick:()=>i(!1),children:`重试成功请求`}),(0,o.jsx)(`output`,{children:e.loading?`提交中`:t}),!!e.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(e.error)})]})}var c=`import * as React from "react";

import { useAsyncAction } from "../../../src";

function Case1() {
  const action = useAsyncAction(async (fail: boolean) => {
    await new Promise((r) => setTimeout(r, 300));
    if (fail) throw Error("演示提交失败");
    return "提交成功";
  });
  const [result, setResult] = React.useState("等待提交");
  const run = (fail: boolean) => {
    void action
      .run(fail)
      .then(setResult)
      .catch(() => setResult("请重试"));
  };
  return (
    <>
      <button disabled={action.loading} onClick={() => run(true)}>
        提交失败请求
      </button>
      <button disabled={action.loading} onClick={() => run(false)}>
        重试成功请求
      </button>
      <output>{action.loading ? "提交中" : result}</output>
      {!!action.error && <p role="alert">{String(action.error)}</p>}
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(0),t=r(async t=>(e.current++,await new Promise(e=>setTimeout(e,200)),t)),[n,i]=a.useState(`未调用`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{disabled:t.loading,onClick:()=>{let n=t.run(`第一组参数`),r=t.run(`第二组参数`);Promise.all([n,r]).then(([t])=>i(`同一 Promise：${n===r}；结果：${t}；实际执行 ${e.current} 次`))},children:`同时提交两次`}),(0,o.jsx)(`output`,{children:n})]})}var u=`import * as React from "react";

import { useAsyncAction } from "../../../src";

function Case2() {
  const count = React.useRef(0);
  const action = useAsyncAction(async (value: string) => {
    count.current++;
    await new Promise((r) => setTimeout(r, 200));
    return value;
  });
  const [result, setResult] = React.useState("未调用");
  return (
    <>
      <button
        disabled={action.loading}
        onClick={() => {
          const a = action.run("第一组参数");
          const b = action.run("第二组参数");
          void Promise.all([a, b]).then(([value]) =>
            setResult(
              \`同一 Promise：\${a === b}；结果：\${value}；实际执行 \${count.current} 次\`,
            ),
          );
        }}
      >
        同时提交两次
      </button>
      <output>{result}</output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`错误后重新提交`,description:`第一次主动模拟失败，下一次传入成功参数，观察错误状态清空。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`并发调用共享结果`,description:`同一事件中连续调用两次，观察 Promise 引用相同且只执行一个任务。`,children:(0,o.jsx)(l,{})})]})}export{d as default};