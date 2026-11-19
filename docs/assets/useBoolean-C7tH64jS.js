import{t as e}from"./Scenario-ApRSINdu.js";import{D as t,b as n}from"./index-C6jdXK2z.js";var r=t();function i(){let e=n();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`label`,{children:[`演示密码`,(0,r.jsx)(`input`,{type:e.value?`text`:`password`,defaultValue:`demo-password`})]}),(0,r.jsx)(`button`,{onClick:e.toggle,children:e.value?`隐藏密码`:`显示密码`})]})}var a=`import { useBoolean } from "../../../src";

function Case1() {
  const visible = useBoolean();
  return (
    <>
      <label>
        演示密码
        <input
          type={visible.value ? "text" : "password"}
          defaultValue="demo-password"
        />
      </label>
      <button onClick={visible.toggle}>
        {visible.value ? "隐藏密码" : "显示密码"}
      </button>
    </>
  );
}

export default Case1;
`;function o(){let e=n(!0);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`div`,{className:`demo-row`,children:[(0,r.jsx)(`button`,{onClick:e.setTrue,children:`启用功能`}),(0,r.jsx)(`button`,{onClick:e.setFalse,children:`停用功能`}),(0,r.jsx)(`button`,{onClick:()=>e.setValue(e=>!e),children:`函数式反转`})]}),(0,r.jsx)(`output`,{children:e.value?`功能已启用`:`功能已停用`})]})}var s=`import { useBoolean } from "../../../src";

function Case2() {
  const state = useBoolean(true);
  return (
    <>
      <div className="demo-row">
        <button onClick={state.setTrue}>启用功能</button>
        <button onClick={state.setFalse}>停用功能</button>
        <button onClick={() => state.setValue((v) => !v)}>函数式反转</button>
      </div>
      <output>{state.value ? "功能已启用" : "功能已停用"}</output>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`密码显示开关`,description:`切换输入框类型，观察同一布尔状态如何同时控制按钮文案和密码可见性。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`显式设置与函数更新`,description:`使用 setTrue、setFalse 与 setValue，重复启用不会反转状态。`,children:(0,r.jsx)(o,{})})]})}export{c as default};