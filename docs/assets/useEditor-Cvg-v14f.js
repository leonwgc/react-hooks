import{t as e}from"./Scenario-lI9aBaLE.js";import{i as t}from"./interaction-Cq61H0dC.js";import{D as n}from"./index-BH-UjxLV.js";var r=n();function i(){let e=t();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`div`,{className:`demo-row`,children:[`文章甲`,`文章乙`].map((t,n)=>(0,r.jsx)(`button`,{onClick:()=>e.edit({id:n,title:t}),children:t},n))}),e.isOpen&&(0,r.jsxs)(`div`,{className:`notice`,children:[`当前编辑：`,e.record?.title,(0,r.jsx)(`button`,{onClick:e.close,children:`收起记录`})]})]})}var a=`import { useEditor } from "../../../src";

function Case1() {
  const editor = useEditor<{ id: number; title: string }>();
  return (
    <>
      <div className="demo-row">
        {["文章甲", "文章乙"].map((title, id) => (
          <button key={id} onClick={() => editor.edit({ id, title })}>
            {title}
          </button>
        ))}
      </div>
      {editor.isOpen && (
        <div className="notice">
          当前编辑：{editor.record?.title}
          <button onClick={editor.close}>收起记录</button>
        </div>
      )}
    </>
  );
}

export default Case1;
`;function o(){let e=t();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>e.edit({name:`已有项目`}),children:`载入已有项目`}),(0,r.jsx)(`button`,{onClick:e.create,children:`切换新建项目`}),(0,r.jsx)(`button`,{onClick:e.close,children:`关闭项目面板`}),(0,r.jsxs)(`output`,{children:[`模式 `,e.mode,` · 记录 `,e.record?.name??`空`,` ·`,` `,e.isOpen?`打开`:`关闭`]})]})}var s=`import { useEditor } from "../../../src";

function Case2() {
  const editor = useEditor<{ name: string }>();
  return (
    <>
      <button onClick={() => editor.edit({ name: "已有项目" })}>
        载入已有项目
      </button>
      <button onClick={editor.create}>切换新建项目</button>
      <button onClick={editor.close}>关闭项目面板</button>
      <output>
        模式 {editor.mode} · 记录 {editor.record?.name ?? "空"} ·{" "}
        {editor.isOpen ? "打开" : "关闭"}
      </output>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`从列表切换编辑对象`,description:`连续选择不同记录，面板显示最新记录；关闭不会删除原始数据。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`新建清空旧记录`,description:`先编辑，再进入新建模式，观察 record 变为 null。`,children:(0,r.jsx)(o,{})})]})}export{c as default};