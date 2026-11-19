import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,h as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let e=i(),[t,n]=a.useState(240);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`卡片最小宽度`,(0,o.jsx)(`input`,{type:`range`,min:120,max:500,value:t,onChange:e=>n(Number(e.target.value))})]}),(0,o.jsxs)(`output`,{children:[`窗口 `,e.width,`px / 卡片 `,t,`px →`,` `,Math.max(1,Math.floor(e.width/t)),` 列`]})]})}var c=`import * as React from "react";

import { useWindowSize } from "../../../src";

function Case1() {
  const size = useWindowSize();
  const [card, setCard] = React.useState(240);
  return (
    <>
      <label>
        卡片最小宽度
        <input
          type="range"
          min={120}
          max={500}
          value={card}
          onChange={(e) => setCard(Number(e.target.value))}
        />
      </label>
      <output>
        窗口 {size.width}px / 卡片 {card}px →{" "}
        {Math.max(1, Math.floor(size.width / card))} 列
      </output>
    </>
  );
}

export default Case1;
`;function l(){let e=i(),[t,n]=a.useState(`未记录`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>n(`${e.width} × ${e.height}`),children:`记录视口快照`}),(0,o.jsxs)(`output`,{children:[`实时 `,e.width,` × `,e.height,` ·`,` `,e.width>=e.height?`横向`:`纵向`]}),(0,o.jsxs)(`output`,{children:[`快照：`,t]}),(0,o.jsx)(`p`,{children:`调整浏览器窗口大小即可观察差异。`})]})}var u=`import * as React from "react";

import { useWindowSize } from "../../../src";

function Case2() {
  const size = useWindowSize();
  const [snapshot, setSnapshot] = React.useState("未记录");
  return (
    <>
      <button onClick={() => setSnapshot(\`\${size.width} × \${size.height}\`)}>
        记录视口快照
      </button>
      <output>
        实时 {size.width} × {size.height} ·{" "}
        {size.width >= size.height ? "横向" : "纵向"}
      </output>
      <output>快照：{snapshot}</output>
      <p>调整浏览器窗口大小即可观察差异。</p>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`按可用宽度计算列数`,description:`改变卡片最小宽度，结合真实窗口宽度计算建议列数。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`视口比例与尺寸快照`,description:`记录当前视口后调整窗口，比较实时值与操作时的快照。`,children:(0,o.jsx)(l,{})})]})}export{d as default};