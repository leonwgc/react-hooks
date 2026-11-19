import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{i as r}from"./browser-Ysu2TECY.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let e=a.useRef(null),t=r(e);return(0,o.jsxs)(`div`,{ref:e,className:`notice`,children:[(0,o.jsx)(`p`,{children:`数据展示面板`}),(0,o.jsx)(`button`,{disabled:!t.supported,onClick:()=>void t.enter(),children:`全屏显示面板`}),(0,o.jsx)(`button`,{onClick:()=>void t.exit(),children:`退出面板全屏`}),(0,o.jsx)(`output`,{children:t.active?`面板全屏中`:t.supported?`普通模式`:`浏览器不支持`}),!!t.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(t.error)})]})}var c=`import * as React from "react";

import { useFullscreen } from "../../../src";

function Case1() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p>数据展示面板</p>
      <button disabled={!f.supported} onClick={() => void f.enter()}>
        全屏显示面板
      </button>
      <button onClick={() => void f.exit()}>退出面板全屏</button>
      <output>
        {f.active ? "面板全屏中" : f.supported ? "普通模式" : "浏览器不支持"}
      </output>
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}

export default Case1;
`;function l(){let e=a.useRef(null),t=r(e);return(0,o.jsxs)(`div`,{ref:e,className:`notice`,children:[(0,o.jsx)(`p`,{style:{fontSize:t.active?24:14},children:`专注阅读：全屏只改变显示方式，不改变文章数据。`}),(0,o.jsx)(`button`,{disabled:!t.supported,onClick:()=>void t.toggle(),children:t.active?`结束专注阅读`:`开始专注阅读`}),!t.supported&&(0,o.jsx)(`p`,{children:`当前环境不支持全屏。`}),!!t.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(t.error)})]})}var u=`import * as React from "react";

import { useFullscreen } from "../../../src";

function Case2() {
  const ref = React.useRef<HTMLDivElement>(null);
  const f = useFullscreen(ref);
  return (
    <div ref={ref} className="notice">
      <p style={{ fontSize: f.active ? 24 : 14 }}>
        专注阅读：全屏只改变显示方式，不改变文章数据。
      </p>
      <button disabled={!f.supported} onClick={() => void f.toggle()}>
        {f.active ? "结束专注阅读" : "开始专注阅读"}
      </button>
      {!f.supported && <p>当前环境不支持全屏。</p>}
      {!!f.error && <p role="alert">{String(f.error)}</p>}
    </div>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`显式进入与退出`,description:`把内容面板设为全屏目标，独立调用 enter 与 exit，并展示错误。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`阅读时切换字号`,description:`全屏状态控制内容字号，退出后恢复普通阅读样式。`,children:(0,o.jsx)(l,{})})]})}export{d as default};