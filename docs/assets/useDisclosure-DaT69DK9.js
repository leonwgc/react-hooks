import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t}from"./interaction-CiM6OlIl.js";import{D as n}from"./index-DcZxIQAI.js";var r=n();function i(){let e=t(!0);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:e.toggle,"aria-expanded":e.isOpen,children:`切换帮助内容`}),(0,r.jsx)(`button`,{onClick:e.open,children:`始终展开`}),e.isOpen&&(0,r.jsx)(`p`,{className:`notice`,children:`这里是帮助说明。`}),(0,r.jsx)(`output`,{children:e.isOpen?`展开`:`收起`})]})}var a=`import { useDisclosure } from "../../../src";

function Case1() {
  const panel = useDisclosure(true);
  return (
    <>
      <button onClick={panel.toggle} aria-expanded={panel.isOpen}>
        切换帮助内容
      </button>
      <button onClick={panel.open}>始终展开</button>
      {panel.isOpen && <p className="notice">这里是帮助说明。</p>}
      <output>{panel.isOpen ? "展开" : "收起"}</output>
    </>
  );
}

export default Case1;
`;function o(){let e=t(),n=t();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>{e.open(),n.close()},children:`查看规格`}),(0,r.jsx)(`button`,{onClick:()=>{n.open(),e.close()},children:`查看配送`}),(0,r.jsx)(`button`,{onClick:()=>{e.close(),n.close()},children:`关闭全部面板`}),e.isOpen&&(0,r.jsx)(`p`,{children:`规格：轻量便携`}),n.isOpen&&(0,r.jsx)(`p`,{children:`配送：次日发货`})]})}var s=`import { useDisclosure } from "../../../src";

function Case2() {
  const a = useDisclosure();
  const b = useDisclosure();
  return (
    <>
      <button
        onClick={() => {
          a.open();
          b.close();
        }}
      >
        查看规格
      </button>
      <button
        onClick={() => {
          b.open();
          a.close();
        }}
      >
        查看配送
      </button>
      <button
        onClick={() => {
          a.close();
          b.close();
        }}
      >
        关闭全部面板
      </button>
      {a.isOpen && <p>规格：轻量便携</p>}
      {b.isOpen && <p>配送：次日发货</p>}
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`默认展开的帮助面板`,description:`通过初始状态控制首次展示，重复打开保持展开。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`互斥的详情面板`,description:`组合两个独立实例，在打开一个时关闭另一个。`,children:(0,r.jsx)(o,{})})]})}export{c as default};