import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./sortable-DN0RZh02.js";import{D as i}from"./index-BH-UjxLV.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState([`第一项`,`第二项`,`第三项`]),[n,i]=a.useState(!0),s=r(e,{getKey:e=>e,onChange:t,disabled:n});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>i(e=>!e),children:n?`解锁排序`:`锁定排序`}),(0,o.jsx)(`button`,{onClick:()=>s.move(0,2),children:`把首项移至末尾`}),(0,o.jsx)(`ol`,{children:e.map(e=>(0,o.jsx)(`li`,{...s.getItemProps(e),children:e},e))}),(0,o.jsx)(`output`,{children:n?`排序已锁定`:s.announcement||`可以排序`})]})}var c=`import * as React from "react";

import { useSortable } from "../../../src";

function Case1() {
  const [items, setItems] = React.useState(["第一项", "第二项", "第三项"]);
  const [disabled, setDisabled] = React.useState(true);
  const s = useSortable(items, {
    getKey: (item) => item,
    onChange: setItems,
    disabled,
  });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "解锁排序" : "锁定排序"}
      </button>
      <button onClick={() => s.move(0, 2)}>把首项移至末尾</button>
      <ol>
        {items.map((item) => (
          <li key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <output>{disabled ? "排序已锁定" : s.announcement || "可以排序"}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState([`设计`,`实现`,`验收`]),[n,i]=a.useState(`等待移动`),s=r(e,{getKey:e=>e,onChange:t});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`ol`,{children:e.map(e=>(0,o.jsx)(`li`,{className:`notice`,...s.getItemProps(e),children:e},e))}),(0,o.jsx)(`button`,{onClick:()=>i(s.move(0,-1)?`移动成功`:`越界未移动`),children:`尝试移到负索引`}),(0,o.jsx)(`output`,{children:s.announcement||n})]})}var u=`import * as React from "react";

import { useSortable } from "../../../src";

function Case2() {
  const [items, setItems] = React.useState(["设计", "实现", "验收"]);
  const [result, setResult] = React.useState("等待移动");
  const s = useSortable(items, { getKey: (item) => item, onChange: setItems });
  return (
    <>
      <ol>
        {items.map((item) => (
          <li className="notice" key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <button
        onClick={() => setResult(s.move(0, -1) ? "移动成功" : "越界未移动")}
      >
        尝试移到负索引
      </button>
      <output>{s.announcement || result}</output>
    </>
  );
}

export default Case2;
`;function d(){let[e,t]=a.useState([`Design`,`Build`,`Ship`]),n=r(e,{getKey:e=>e,onChange:t,messages:{roleDescription:`sortable item`,picked:e=>`Picked up item ${e}. Use arrow keys to move.`,moved:(e,t)=>`Moved to position ${e} of ${t}.`,finished:`Reordering finished.`,cancelled:`Reordering cancelled.`}});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{children:`Focus target outside the list`}),(0,o.jsx)(`ol`,{children:e.map(e=>(0,o.jsx)(`li`,{className:`notice`,...n.getItemProps(e),children:e},e))}),(0,o.jsx)(`p`,{children:`Focus an item, press Space and an arrow key, then press Tab: moving focus away cancels and restores the original order.`}),(0,o.jsx)(`output`,{role:`status`,children:n.announcement||`Waiting`})]})}var f=`import * as React from "react";

import { useSortable } from "../../../src";

function Feature1() {
  const [items, setItems] = React.useState(["Design", "Build", "Ship"]);
  const s = useSortable(items, {
    getKey: (item) => item,
    onChange: setItems,
    messages: {
      roleDescription: "sortable item",
      picked: (position) =>
        \`Picked up item \${position}. Use arrow keys to move.\`,
      moved: (position, total) => \`Moved to position \${position} of \${total}.\`,
      finished: "Reordering finished.",
      cancelled: "Reordering cancelled.",
    },
  });
  return (
    <>
      <button>Focus target outside the list</button>
      <ol>
        {items.map((item) => (
          <li className="notice" key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <p>
        Focus an item, press Space and an arrow key, then press Tab: moving
        focus away cancels and restores the original order.
      </p>
      <output role="status">{s.announcement || "Waiting"}</output>
    </>
  );
}

export default Feature1;
`;function p(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`禁用排序与受控数据`,description:`锁定后拖放、键盘和 move 都不会改动列表；解锁后再尝试移动。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`键盘取消与边界移动`,description:`聚焦项目后按空格拾取、方向键移动、Esc 恢复原顺序；越界 move 返回 false。`,children:(0,o.jsx)(l,{})}),(0,o.jsx)(e,{source:f,title:`自定义播报文案与失焦取消`,description:`通过 messages 提供英文读屏文案；键盘排序过程中焦点离开列表会取消并恢复原顺序。`,children:(0,o.jsx)(d,{})})]})}export{p as default};