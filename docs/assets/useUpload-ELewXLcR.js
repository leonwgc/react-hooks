import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./queue-EeqcwLCU.js";import{t as i}from"./webHelpers-C9HRgI6m.js";import{D as a}from"./index-DcZxIQAI.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(`等待文件`),n=r({concurrency:1,transport:async({file:e,signal:t,onProgress:n})=>(await i(t,300),n(e.size,e.size),e.name)}),a=e=>{let r=e.filter(e=>e.size<=1024);t(`接受 ${r.length} / ${e.length} 个文件（上限 1KB）`),n.add(r)};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`label`,{children:[`校验上传文件`,(0,s.jsx)(`input`,{type:`file`,multiple:!0,onChange:e=>a(Array.from(e.target.files??[]))})]}),(0,s.jsx)(`button`,{onClick:()=>a([new File([`demo`],`small.txt`),new File([`x`.repeat(2048)],`large.txt`)]),children:`加入大小不同的示例文件`}),(0,s.jsx)(`output`,{children:e}),(0,s.jsx)(`ul`,{children:n.uploads.map(e=>(0,s.jsxs)(`li`,{children:[e.file.name,`：`,e.status,` · `,e.progress,`%`]},e.id))})]})}var l=`import * as React from "react";

import { useUpload } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [message, setMessage] = React.useState("等待文件");
  const u = useUpload({
    concurrency: 1,
    transport: async ({ file, signal, onProgress }) => {
      await delay(signal, 300);
      onProgress(file.size, file.size);
      return file.name;
    },
  });
  const add = (files: File[]) => {
    const valid = files.filter((f) => f.size <= 1024);
    setMessage(\`接受 \${valid.length} / \${files.length} 个文件（上限 1KB）\`);
    u.add(valid);
  };
  return (
    <>
      <label>
        校验上传文件
        <input
          type="file"
          multiple
          onChange={(e) => add(Array.from(e.target.files ?? []))}
        />
      </label>
      <button
        onClick={() =>
          add([
            new File(["demo"], "small.txt"),
            new File(["x".repeat(2048)], "large.txt"),
          ])
        }
      >
        加入大小不同的示例文件
      </button>
      <output>{message}</output>
      <ul>
        {u.uploads.map((t) => (
          <li key={t.id}>
            {t.file.name}：{t.status} · {t.progress}%
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case1;
`;function u(){let e=r({concurrency:1,transport:async({file:e,signal:t,onProgress:n})=>{for(let e=1;e<=4;e++)await i(t,250),n(e,4);return e.name}});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>e.add([1,2,3].map(e=>new File([`demo`],`queue-${e}.txt`))),children:`加入三个模拟上传`}),(0,s.jsx)(`button`,{onClick:e.paused?e.resume:e.pause,children:e.paused?`恢复上传调度`:`暂停上传调度`}),(0,s.jsx)(`button`,{onClick:e.cancelAll,children:`取消所有上传任务`}),(0,s.jsx)(`button`,{onClick:e.clear,children:`清理上传历史`}),(0,s.jsx)(`ul`,{children:e.uploads.map(e=>(0,s.jsxs)(`li`,{children:[e.file.name,`：`,e.status,` · `,e.progress,`%`]},e.id))})]})}var d=`import { useUpload } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const u = useUpload({
    concurrency: 1,
    transport: async ({ file, signal, onProgress }) => {
      for (let i = 1; i <= 4; i++) {
        await delay(signal, 250);
        onProgress(i, 4);
      }
      return file.name;
    },
  });
  return (
    <>
      <button
        onClick={() =>
          u.add([1, 2, 3].map((n) => new File(["demo"], \`queue-\${n}.txt\`)))
        }
      >
        加入三个模拟上传
      </button>
      <button onClick={u.paused ? u.resume : u.pause}>
        {u.paused ? "恢复上传调度" : "暂停上传调度"}
      </button>
      <button onClick={u.cancelAll}>取消所有上传任务</button>
      <button onClick={u.clear}>清理上传历史</button>
      <ul>
        {u.uploads.map((t) => (
          <li key={t.id}>
            {t.file.name}：{t.status} · {t.progress}%
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
`;function f(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`上传前校验与批量加入`,description:`在调用 add 前检查文件大小；按钮创建小型本地示例文件，传输完全在内存模拟。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`暂停排队与恢复传输`,description:`暂停只阻止新任务启动，正在进行的任务继续；可取消全部并清除已结束任务。`,children:(0,s.jsx)(u,{})})]})}export{f as default};