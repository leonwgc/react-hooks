import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{r}from"./document-DIcCfjcn.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let e=a.useRef(null),[t,n]=a.useState(``),[i,s]=a.useState(3),c=r(e,t,{minRows:1,maxRows:i});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`最多显示行数`,(0,o.jsxs)(`select`,{value:i,onChange:e=>s(Number(e.target.value)),children:[(0,o.jsx)(`option`,{children:`3`}),(0,o.jsx)(`option`,{children:`6`})]})]}),(0,o.jsxs)(`label`,{children:[`行数限制文本`,(0,o.jsx)(`textarea`,{ref:e,value:t,onChange:e=>n(e.target.value),style:{minHeight:0,lineHeight:`22px`,resize:`none`}})]}),(0,o.jsx)(`button`,{onClick:()=>n(`一行
二行
三行
四行
五行`),children:`填入五行`}),(0,o.jsx)(`button`,{onClick:()=>n(``),children:`清空多行文本`}),(0,o.jsxs)(`output`,{children:[`高度 `,Math.round(c.height),`px`]})]})}var c=`import * as React from "react";

import { useTextareaAutoSize } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("");
  const [max, setMax] = React.useState(3);
  const size = useTextareaAutoSize(ref, text, { minRows: 1, maxRows: max });
  return (
    <>
      <label>
        最多显示行数
        <select value={max} onChange={(e) => setMax(Number(e.target.value))}>
          <option>3</option>
          <option>6</option>
        </select>
      </label>
      <label>
        行数限制文本
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ minHeight: 0, lineHeight: "22px", resize: "none" }}
        />
      </label>
      <button
        onClick={() =>
          setText(\`一行
二行
三行
四行
五行\`)
        }
      >
        填入五行
      </button>
      <button onClick={() => setText("")}>清空多行文本</button>
      <output>高度 {Math.round(size.height)}px</output>
    </>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),[t,n]=a.useState(`可以调整的文本域`),[i,s]=a.useState(!0),c=r(e,t,{enabled:i,minRows:2});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`可暂停自增高`,(0,o.jsx)(`textarea`,{ref:e,value:t,onChange:e=>n(e.target.value),style:{height:100,minHeight:0,lineHeight:`22px`}})]}),(0,o.jsx)(`button`,{onClick:()=>s(e=>!e),children:i?`停用自增高`:`启用自增高`}),(0,o.jsx)(`button`,{onClick:c.resize,children:`手动测量文本域`}),(0,o.jsxs)(`output`,{children:[i?`自动模式`:`原始 100px 高度`,` · `,Math.round(c.height),`px`]})]})}var u=`import * as React from "react";

import { useTextareaAutoSize } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState("可以调整的文本域");
  const [enabled, setEnabled] = React.useState(true);
  const size = useTextareaAutoSize(ref, text, { enabled, minRows: 2 });
  return (
    <>
      <label>
        可暂停自增高
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ height: 100, minHeight: 0, lineHeight: "22px" }}
        />
      </label>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停用自增高" : "启用自增高"}
      </button>
      <button onClick={size.resize}>手动测量文本域</button>
      <output>
        {enabled ? "自动模式" : "原始 100px 高度"} · {Math.round(size.height)}px
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`行数上限与内容收缩`,description:`输入或填入长内容，观察最大行数限制；清空后恢复最少行数。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`禁用与手动重新测量`,description:`关闭后恢复原内联高度，启用后重新测量；手动 resize 可用于外部字体和样式变化。`,children:(0,o.jsx)(l,{})})]})}export{d as default};