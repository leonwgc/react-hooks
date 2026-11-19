import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{a as r}from"./browser-Dl19CO1P.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i(),s=`data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%2280%22%3E%3Crect%20width%3D%22240%22%20height%3D%2280%22%20fill%3D%22%2316856b%22%2F%3E%3C%2Fsvg%3E`;function c(){let[e,t]=a.useState(!1),n=r(e?s:null);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`停止并清空图片`:`加载演示图片`}),n.src&&n.status===`loaded`&&(0,o.jsx)(`img`,{src:n.src,alt:`绿色示例卡片`,style:{maxWidth:`100%`}}),(0,o.jsxs)(`output`,{children:[n.status,` · `,n.width,`×`,n.height]})]})}var l=`import * as React from "react";

import { useImage } from "../../../src";

const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" fill="#16856b"/></svg>',
  );

function Case1() {
  const [enabled, setEnabled] = React.useState(false);
  const image = useImage(enabled ? picture : null);
  return (
    <>
      <button onClick={() => setEnabled((v) => !v)}>
        {enabled ? "停止并清空图片" : "加载演示图片"}
      </button>
      {image.src && image.status === "loaded" && (
        <img src={image.src} alt="绿色示例卡片" style={{ maxWidth: "100%" }} />
      )}
      <output>
        {image.status} · {image.width}×{image.height}
      </output>
    </>
  );
}

export default Case1;
`,u=`data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%2280%22%3E%3Crect%20width%3D%22240%22%20height%3D%2280%22%20fill%3D%22%2316856b%22%2F%3E%3C%2Fsvg%3E`;function d(){let[e,t]=a.useState(!0),n=r(e?`data:image/png;base64,invalid`:u);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>!e),children:e?`切换正确图片`:`切换损坏图片`}),(0,o.jsxs)(`output`,{children:[`加载状态 `,n.status]}),n.status===`loaded`&&n.src&&(0,o.jsx)(`img`,{src:n.src,alt:`恢复后的卡片`,style:{maxWidth:`100%`}}),!!n.error&&(0,o.jsx)(`p`,{role:`alert`,children:`图片加载失败，可切换地址重试。`})]})}var f=`import * as React from "react";

import { useImage } from "../../../src";

const picture =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" fill="#16856b"/></svg>',
  );

function Case2() {
  const [broken, setBroken] = React.useState(true);
  const image = useImage(broken ? "data:image/png;base64,invalid" : picture);
  return (
    <>
      <button onClick={() => setBroken((v) => !v)}>
        {broken ? "切换正确图片" : "切换损坏图片"}
      </button>
      <output>加载状态 {image.status}</output>
      {image.status === "loaded" && image.src && (
        <img src={image.src} alt="恢复后的卡片" style={{ maxWidth: "100%" }} />
      )}
      {!!image.error && <p role="alert">图片加载失败，可切换地址重试。</p>}
    </>
  );
}

export default Case2;
`,p=e=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="${e}"/></svg>`)}`,m=[p(`#4f7cff`),p(`#22a06b`),`/missing-image.png`];function h(){let[e,t]=a.useState(0),n=m[e%m.length],i=r(n),[s,c]=a.useState([]),l=`${e%m.length+1}:${i.status}`;return a.useEffect(()=>{c(e=>e.at(-1)===l?e:[...e,l].slice(-6))},[l]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(e=>e+1),children:`切换到下一张图片`}),(0,o.jsxs)(`output`,{children:[`当前第 `,e%m.length+1,` 张 · `,i.status,` · 返回的 src`,i.src===n?`与请求一致`:`不一致`]}),i.status===`loaded`&&(0,o.jsx)(`img`,{src:i.src,alt:`当前图片`}),(0,o.jsxs)(`p`,{children:[`最近状态（序号:状态）：`,s.join(` → `)]})]})}var g=`import * as React from "react";

import { useImage } from "../../../src";

const svg = (color: string) =>
  \`data:image/svg+xml,\${encodeURIComponent(
    \`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="\${color}"/></svg>\`,
  )}\`;
const sources = [svg("#4f7cff"), svg("#22a06b"), "/missing-image.png"];

function Feature1() {
  const [index, setIndex] = React.useState(0);
  const src = sources[index % sources.length]!;
  const image = useImage(src);
  const [history, setHistory] = React.useState<string[]>([]);
  const entry = \`\${(index % sources.length) + 1}:\${image.status}\`;
  React.useEffect(() => {
    setHistory((list) =>
      list.at(-1) === entry ? list : [...list, entry].slice(-6),
    );
  }, [entry]);
  return (
    <>
      <button onClick={() => setIndex((n) => n + 1)}>切换到下一张图片</button>
      <output>
        当前第 {(index % sources.length) + 1} 张 · {image.status} · 返回的 src
        {image.src === src ? "与请求一致" : "不一致"}
      </output>
      {image.status === "loaded" && <img src={image.src!} alt="当前图片" />}
      <p>最近状态（序号:状态）：{history.join(" → ")}</p>
    </>
  );
}

export default Feature1;
`;function _(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:l,title:`按需启动图片加载`,description:`最初传入 null，点击后加载本地生成的 SVG，不访问外部图片服务。`,children:(0,o.jsx)(c,{})}),(0,o.jsx)(e,{source:f,title:`错误状态与切换恢复`,description:`不设置备用图时，损坏图片进入 error；切换正确地址后可恢复。`,children:(0,o.jsx)(d,{})}),(0,o.jsx)(e,{source:g,title:`切换图片不闪现旧结果`,description:`切换 src 后立即报告新图片的 loading，不会短暂返回上一张图片的 loaded 状态；第三张为失败示例。`,children:(0,o.jsx)(h,{})})]})}export{_ as default};