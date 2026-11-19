import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{D as r,l as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=r();function s(){let[e,t]=a.useState(800),n=i(`(min-width: ${e}px)`);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`断点宽度`,(0,o.jsx)(`input`,{type:`range`,min:300,max:1600,value:e,onChange:e=>t(Number(e.target.value))})]}),(0,o.jsxs)(`output`,{children:[`窗口 ≥ `,e,`px：`,n?`匹配`:`不匹配`]})]})}var c=`import * as React from "react";

import { useMediaQuery } from "../../../src";

function Case1() {
  const [width, setWidth] = React.useState(800);
  const matches = useMediaQuery(\`(min-width: \${width}px)\`);
  return (
    <>
      <label>
        断点宽度
        <input
          type="range"
          min={300}
          max={1600}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <output>
        窗口 ≥ {width}px：{matches ? "匹配" : "不匹配"}
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(`(hover: hover)`),n=i(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`媒体能力`,(0,o.jsxs)(`select`,{value:e,onChange:e=>t(e.target.value),children:[(0,o.jsx)(`option`,{children:`(hover: hover)`}),(0,o.jsx)(`option`,{children:`(pointer: fine)`}),(0,o.jsx)(`option`,{children:`(prefers-color-scheme: dark)`})]})]}),(0,o.jsxs)(`output`,{children:[e,`：`,n?`支持 / 匹配`:`不匹配`]})]})}var u=`import * as React from "react";

import { useMediaQuery } from "../../../src";

function Case2() {
  const [query, setQuery] = React.useState("(hover: hover)");
  const matches = useMediaQuery(query);
  return (
    <>
      <label>
        媒体能力
        <select value={query} onChange={(e) => setQuery(e.target.value)}>
          <option>(hover: hover)</option>
          <option>(pointer: fine)</option>
          <option>(prefers-color-scheme: dark)</option>
        </select>
      </label>
      <output>
        {query}：{matches ? "支持 / 匹配" : "不匹配"}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`动态响应式断点`,description:`修改断点输入，媒体查询随配置变化重新订阅。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`切换设备能力查询`,description:`选择悬停能力、精细指针或系统深色模式，读取真实浏览器状态。`,children:(0,o.jsx)(l,{})})]})}export{d as default};