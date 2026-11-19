import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./list-DyDhq8B8.js";import{D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let e=a.useMemo(()=>Array.from({length:200},(e,t)=>`记录 ${t+1}`),[]),t=r(e,{itemHeight:36,height:180,getKey:e=>e,overscan:2});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t.scrollTo(99,`center`),children:`居中定位第 100 项`}),(0,o.jsx)(`button`,{onClick:()=>t.scrollTo(199,`end`),children:`定位最后一项`}),(0,o.jsx)(`div`,{ref:t.containerRef,onScroll:t.onScroll,style:t.containerStyle,children:(0,o.jsx)(`div`,{style:{height:t.totalHeight,position:`relative`},children:t.virtualItems.map(e=>(0,o.jsx)(`div`,{style:e.style,children:e.item},e.key))})}),(0,o.jsxs)(`output`,{children:[`渲染 `,t.virtualItems.length,` / `,e.length,` 条`]})]})}var c=`import * as React from "react";

import { useVirtualList } from "../../../src";

function Case1() {
  const items = React.useMemo(
    () => Array.from({ length: 200 }, (_, i) => \`记录 \${i + 1}\`),
    [],
  );
  const v = useVirtualList(items, {
    itemHeight: 36,
    height: 180,
    getKey: (item) => item,
    overscan: 2,
  });
  return (
    <>
      <button onClick={() => v.scrollTo(99, "center")}>
        居中定位第 100 项
      </button>
      <button onClick={() => v.scrollTo(199, "end")}>定位最后一项</button>
      <div ref={v.containerRef} onScroll={v.onScroll} style={v.containerStyle}>
        <div style={{ height: v.totalHeight, position: "relative" }}>
          {v.virtualItems.map((row) => (
            <div key={row.key} style={row.style}>
              {row.item}
            </div>
          ))}
        </div>
      </div>
      <output>
        渲染 {v.virtualItems.length} / {items.length} 条
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState([]),n=r(e,{itemHeight:32,height:160,getKey:e=>e});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>[...e,...Array.from({length:50},(t,n)=>e.length+n+1)]),children:`追加五十条`}),(0,o.jsx)(`button`,{onClick:()=>t([]),children:`清空虚拟数据`}),(0,o.jsxs)(`div`,{ref:n.containerRef,onScroll:n.onScroll,style:n.containerStyle,children:[!e.length&&(0,o.jsx)(`p`,{children:`暂无记录`}),(0,o.jsx)(`div`,{style:{height:n.totalHeight,position:`relative`},children:n.virtualItems.map(e=>(0,o.jsxs)(`div`,{style:e.style,children:[`新增记录 `,e.item]},e.key))})]}),(0,o.jsxs)(`output`,{children:[`总高度 `,n.totalHeight,`px · `,e.length,` 条`]})]})}var u=`import * as React from "react";

import { useVirtualList } from "../../../src";

function Case2() {
  const [items, setItems] = React.useState<number[]>([]);
  const v = useVirtualList(items, {
    itemHeight: 32,
    height: 160,
    getKey: (item) => item,
  });
  return (
    <>
      <button
        onClick={() =>
          setItems((s) => [
            ...s,
            ...Array.from({ length: 50 }, (_, i) => s.length + i + 1),
          ])
        }
      >
        追加五十条
      </button>
      <button onClick={() => setItems([])}>清空虚拟数据</button>
      <div ref={v.containerRef} onScroll={v.onScroll} style={v.containerStyle}>
        {!items.length && <p>暂无记录</p>}
        <div style={{ height: v.totalHeight, position: "relative" }}>
          {v.virtualItems.map((row) => (
            <div key={row.key} style={row.style}>
              新增记录 {row.item}
            </div>
          ))}
        </div>
      </div>
      <output>
        总高度 {v.totalHeight}px · {items.length} 条
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`固定行高与定位方式`,description:`在两百条数据中跳转到指定索引，可选择居中或末尾对齐。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`空列表与追加数据`,description:`从空列表开始添加数据，清空后占位高度归零，避免保留旧滚动范围。`,children:(0,o.jsx)(l,{})})]})}export{d as default};