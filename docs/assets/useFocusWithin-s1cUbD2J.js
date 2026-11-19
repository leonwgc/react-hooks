import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t}from"./interaction-D-ABlDu0.js";import{D as n}from"./index-BH-UjxLV.js";var r=n();function i(){let e=t();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`fieldset`,{...e.bind,children:[(0,r.jsx)(`legend`,{children:`组合地址`}),(0,r.jsxs)(`label`,{children:[`城市`,(0,r.jsx)(`input`,{})]}),(0,r.jsxs)(`label`,{children:[`街道`,(0,r.jsx)(`input`,{})]}),e.focused&&(0,r.jsx)(`p`,{children:`可用 Tab 在地址字段间切换。`})]}),(0,r.jsx)(`button`,{children:`聚焦区域外`}),(0,r.jsx)(`output`,{children:e.focused?`正在填写地址`:`地址区域未聚焦`})]})}var a=`import { useFocusWithin } from "../../../src";

function Case1() {
  const f = useFocusWithin();
  return (
    <>
      <fieldset {...f.bind}>
        <legend>组合地址</legend>
        <label>
          城市
          <input />
        </label>
        <label>
          街道
          <input />
        </label>
        {f.focused && <p>可用 Tab 在地址字段间切换。</p>}
      </fieldset>
      <button>聚焦区域外</button>
      <output>{f.focused ? "正在填写地址" : "地址区域未聚焦"}</output>
    </>
  );
}

export default Case1;
`;function o(){let e=t(),n=t();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`div`,{...e.bind,children:[(0,r.jsxs)(`label`,{children:[`主标题`,(0,r.jsx)(`input`,{})]}),(0,r.jsxs)(`output`,{children:[`主区域：`,String(e.focused)]})]}),(0,r.jsxs)(`div`,{...n.bind,children:[(0,r.jsxs)(`label`,{children:[`副标题`,(0,r.jsx)(`input`,{})]}),(0,r.jsxs)(`output`,{children:[`副区域：`,String(n.focused)]})]})]})}var s=`import { useFocusWithin } from "../../../src";

function Case2() {
  const a = useFocusWithin();
  const b = useFocusWithin();
  return (
    <>
      <div {...a.bind}>
        <label>
          主标题
          <input />
        </label>
        <output>主区域：{String(a.focused)}</output>
      </div>
      <div {...b.bind}>
        <label>
          副标题
          <input />
        </label>
        <output>副区域：{String(b.focused)}</output>
      </div>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`聚焦提示与外部控件`,description:`在组内多个输入之间切换焦点不会退出区域，聚焦外部按钮会隐藏提示。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`两个独立焦点区域`,description:`每个区域独立追踪；从一个区域切换到另一个不会互相混淆。`,children:(0,r.jsx)(o,{})})]})}export{c as default};