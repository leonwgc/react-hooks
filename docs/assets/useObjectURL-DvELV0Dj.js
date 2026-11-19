import{t as e}from"./Scenario-qCntdwnE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{n as r}from"./document-DIcCfjcn.js";import{D as i}from"./index--S_n-0Gu.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(null),n=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`预览图片`,(0,o.jsx)(`input`,{type:`file`,accept:`image/*`,onChange:e=>t(e.target.files?.[0]??null)})]}),n.url&&(0,o.jsx)(`img`,{src:n.url,alt:`本地选择的预览图片`,style:{maxWidth:`100%`,maxHeight:180,objectFit:`contain`}}),(0,o.jsx)(`button`,{onClick:()=>t(null),children:`移除文件预览`}),(0,o.jsx)(`output`,{children:e?.name??`未选择文件`})]})}var c=`import * as React from "react";

import { useObjectURL } from "../../../src";

function Case1() {
  const [file, setFile] = React.useState<File | null>(null);
  const value = useObjectURL(file);
  return (
    <>
      <label>
        预览图片
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {value.url && (
        <img
          src={value.url}
          alt="本地选择的预览图片"
          style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain" }}
        />
      )}
      <button onClick={() => setFile(null)}>移除文件预览</button>
      <output>{file?.name ?? "未选择文件"}</output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(null),[n,i]=a.useState(0),s=r(e);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>{i(e=>e+1),t(new Blob([`版本 ${n+1}`],{type:`text/plain`}))},children:`生成下一版文本 Blob`}),(0,o.jsx)(`button`,{onClick:()=>t(null),children:`清空对象 URL`}),(0,o.jsx)(`output`,{children:s.url??`URL 已释放`}),!!s.error&&(0,o.jsx)(`p`,{role:`alert`,children:String(s.error)})]})}var u=`import * as React from "react";

import { useObjectURL } from "../../../src";

function Case2() {
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [count, setCount] = React.useState(0);
  const value = useObjectURL(blob);
  return (
    <>
      <button
        onClick={() => {
          setCount((n) => n + 1);
          setBlob(new Blob([\`版本 \${count + 1}\`], { type: "text/plain" }));
        }}
      >
        生成下一版文本 Blob
      </button>
      <button onClick={() => setBlob(null)}>清空对象 URL</button>
      <output>{value.url ?? "URL 已释放"}</output>
      {!!value.error && <p role="alert">{String(value.error)}</p>}
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`选择本地图片预览`,description:`选择文件后生成对象 URL，不上传到外部服务；替换文件会释放旧地址。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`替换 Blob 与显式释放`,description:`生成不同文本 Blob，观察地址变化；传入 null 后地址立即消失。`,children:(0,o.jsx)(l,{})})]})}export{d as default};