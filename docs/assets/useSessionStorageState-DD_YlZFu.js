import{t as e}from"./Scenario-ApRSINdu.js";import{D as t,p as n}from"./index-C6jdXK2z.js";var r=t();function i(){let e=n(`web-hooks:examples:useSessionStorageState:object`,{count:0,name:`访客`});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>e.setValue(e=>({...e,count:e.count+1})),children:`增加持久计数`}),(0,r.jsx)(`button`,{onClick:e.remove,children:`清除对象记录`}),(0,r.jsx)(`output`,{children:JSON.stringify(e.value)}),!!e.error&&(0,r.jsx)(`p`,{role:`alert`,children:String(e.error)})]})}var a=`import { useSessionStorageState } from "../../../src";

function Case1() {
  const s = useSessionStorageState(
    "web-hooks:examples:useSessionStorageState:object",
    { count: 0, name: "访客" },
  );
  return (
    <>
      <button onClick={() => s.setValue((v) => ({ ...v, count: v.count + 1 }))}>
        增加持久计数
      </button>
      <button onClick={s.remove}>清除对象记录</button>
      <output>{JSON.stringify(s.value)}</output>
      {!!s.error && <p role="alert">{String(s.error)}</p>}
    </>
  );
}

export default Case1;
`;function o(){let e=n(`web-hooks:examples:useSessionStorageState:shared`,0),t=n(`web-hooks:examples:useSessionStorageState:shared`,0);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>e.setValue(e=>e+1),children:`从实例 A 加一`}),(0,r.jsx)(`button`,{onClick:()=>t.setValue(e=>e+10),children:`从实例 B 加十`}),(0,r.jsx)(`button`,{onClick:e.remove,children:`清除共享值`}),(0,r.jsxs)(`output`,{children:[`A `,e.value,` · B `,t.value]})]})}var s=`import { useSessionStorageState } from "../../../src";

function Case2() {
  const a = useSessionStorageState(
    "web-hooks:examples:useSessionStorageState:shared",
    0,
  );
  const b = useSessionStorageState(
    "web-hooks:examples:useSessionStorageState:shared",
    0,
  );
  return (
    <>
      <button onClick={() => a.setValue((n) => n + 1)}>从实例 A 加一</button>
      <button onClick={() => b.setValue((n) => n + 10)}>从实例 B 加十</button>
      <button onClick={a.remove}>清除共享值</button>
      <output>
        A {a.value} · B {b.value}
      </output>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`对象状态与函数更新`,description:`将对象保存到独立演示键，累计更新后可清除，刷新页面观察持久化。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`同页两个实例同步`,description:`两个 Hook 使用同一个独立键，任一实例写入后另一个也会更新。`,children:(0,r.jsx)(o,{})})]})}export{c as default};