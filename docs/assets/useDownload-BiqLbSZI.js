import{t as e}from"./Scenario-ApRSINdu.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./browser-Dl19CO1P.js";import{D as i}from"./index-C6jdXK2z.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(1),n=r();return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`报表数量`,(0,o.jsx)(`input`,{type:`number`,min:1,value:e,onChange:e=>t(Number(e.target.value))})]}),(0,o.jsx)(`button`,{onClick:()=>void n.download(new Blob([`﻿名称,数量
Hooks,`+e],{type:`text/csv;charset=utf-8`}),`hooks-report.csv`).catch(()=>{}),children:`下载 CSV 报表`}),!!n.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(n.error)})]})}var c=`import * as React from "react";

import { useDownload } from "../../../src";

function Case1() {
  const [count, setCount] = React.useState(1);
  const d = useDownload();
  return (
    <>
      <label>
        报表数量
        <input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() =>
          void d
            .download(
              new Blob(["﻿名称,数量\\nHooks," + count], {
                type: "text/csv;charset=utf-8",
              }),
              "hooks-report.csv",
            )
            .catch(() => {})
        }
      >
        下载 CSV 报表
      </button>
      {!!d.error && <p role="alert">{String(d.error)}</p>}
    </>
  );
}

export default Case1;
`;function l(){let e=r(),[t,n]=a.useState(`未下载`),i=t=>{let r=e.download(`data:text/plain;charset=utf-8,Hello%20Hooks`,`url-demo.txt`);t&&e.cancel(),r.then(()=>n(`已交给浏览器保存`)).catch(()=>n(t?`已取消下载`:`下载失败`))};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>i(!1),children:`下载 URL 文本`}),(0,o.jsx)(`button`,{onClick:()=>i(!0),children:`启动并立即取消`}),(0,o.jsx)(`output`,{children:e.loading?`下载中`:t}),!!e.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(e.error)})]})}var u=`import * as React from "react";

import { useDownload } from "../../../src";

function Case2() {
  const d = useDownload();
  const [result, setResult] = React.useState("未下载");
  const run = (cancel: boolean) => {
    const pending = d.download(
      "data:text/plain;charset=utf-8,Hello%20Hooks",
      "url-demo.txt",
    );
    if (cancel) d.cancel();
    void pending
      .then(() => setResult("已交给浏览器保存"))
      .catch(() => setResult(cancel ? "已取消下载" : "下载失败"));
  };
  return (
    <>
      <button onClick={() => run(false)}>下载 URL 文本</button>
      <button onClick={() => run(true)}>启动并立即取消</button>
      <output>{d.loading ? "下载中" : result}</output>
      {!!d.error && <p role="alert">{String(d.error)}</p>}
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`本地生成 CSV 报表`,description:`修改数量后下载本地 CSV，演示数据不经过服务器。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`URL 下载与立即取消`,description:`使用本地 data URL 演示 fetch 路径；立即取消会阻止保存，无需请求外部服务器。`,children:(0,o.jsx)(l,{})})]})}export{d as default};