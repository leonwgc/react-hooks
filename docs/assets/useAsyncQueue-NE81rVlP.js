import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./queue-DdVDMtC3.js";import{t as i}from"./webHelpers-C9HRgI6m.js";import{D as a}from"./index-BH-UjxLV.js";var o=t(n(),1),s=a();function c(){let[e,t]=o.useState(1),n=r({concurrency:e});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`label`,{children:[`并发上限`,(0,s.jsxs)(`select`,{value:e,onChange:e=>t(Number(e.target.value)),children:[(0,s.jsx)(`option`,{children:`1`}),(0,s.jsx)(`option`,{children:`3`})]})]}),(0,s.jsx)(`button`,{onClick:()=>{for(let e=0;e<4;e++)n.add(async t=>(await i(t,1200),e),`批量任务 ${e+1}`)},children:`新增四个任务`}),(0,s.jsx)(`button`,{onClick:n.cancelAll,children:`取消这批任务`}),(0,s.jsxs)(`output`,{children:[`运行 `,n.running,` · 等待 `,n.pending]}),(0,s.jsx)(`ul`,{children:n.tasks.map(e=>(0,s.jsxs)(`li`,{children:[e.label,`：`,e.status]},e.id))})]})}var l=`import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case1() {
  const [limit, setLimit] = React.useState(1);
  const q = useAsyncQueue<number>({ concurrency: limit });
  return (
    <>
      <label>
        并发上限
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option>1</option>
          <option>3</option>
        </select>
      </label>
      <button
        onClick={() => {
          for (let i = 0; i < 4; i++)
            q.add(
              async (signal) => {
                await delay(signal, 1200);
                return i;
              },
              \`批量任务 \${i + 1}\`,
            );
        }}
      >
        新增四个任务
      </button>
      <button onClick={q.cancelAll}>取消这批任务</button>
      <output>
        运行 {q.running} · 等待 {q.pending}
      </output>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case1;
`;function u(){let e=r({concurrency:1});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>{e.add(async e=>{throw await i(e,100),Error(`演示任务失败`)},`失败任务`),e.add(async e=>(await i(e,100),`成功结果`),`后续任务`)},children:`加入失败和成功任务`}),(0,s.jsx)(`button`,{onClick:e.clear,children:`清理结束任务`}),(0,s.jsx)(`ul`,{children:e.tasks.map(e=>(0,s.jsxs)(`li`,{children:[e.label,`：`,e.status,` `,e.result,` `,e.error?String(e.error):``]},e.id))})]})}var d=`import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Case2() {
  const q = useAsyncQueue<string>({ concurrency: 1 });
  return (
    <>
      <button
        onClick={() => {
          q.add(async (signal) => {
            await delay(signal, 100);
            throw Error("演示任务失败");
          }, "失败任务");
          q.add(async (signal) => {
            await delay(signal, 100);
            return "成功结果";
          }, "后续任务");
        }}
      >
        加入失败和成功任务
      </button>
      <button onClick={q.clear}>清理结束任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status} {t.result} {t.error ? String(t.error) : ""}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Case2;
`;function f(){let[e,t]=o.useState([]),[n,a]=o.useState(``),c=r({concurrency:1,capacity:2}),l=(e,n)=>{c.add(async n=>(await i(n,250),t(t=>[...t,e]),e),e,{priority:n}).promise.catch(e=>a(String(e)))};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>{c.pause(),t([]),a(``),l(`普通任务`,0),l(`高优先级`,10),l(`超额任务`,20)},children:`准备优先级队列`}),(0,s.jsx)(`button`,{onClick:c.resume,children:`恢复优先级调度`}),(0,s.jsx)(`output`,{children:e.join(` → `)||`等待运行`}),n&&(0,s.jsx)(`p`,{role:`alert`,children:n}),(0,s.jsx)(`ul`,{children:c.tasks.map(e=>(0,s.jsxs)(`li`,{children:[e.label,` · `,e.status]},e.id))})]})}var p=`import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced1() {
  const [log, setLog] = React.useState<string[]>([]),
    [error, setError] = React.useState("");
  const q = useAsyncQueue<string>({ concurrency: 1, capacity: 2 });
  const add = (label: string, priority: number) => {
    const h = q.add(
      async (signal) => {
        await delay(signal, 250);
        setLog((x) => [...x, label]);
        return label;
      },
      label,
      { priority },
    );
    void h.promise.catch((e) => setError(String(e)));
  };
  return (
    <>
      <button
        onClick={() => {
          q.pause();
          setLog([]);
          setError("");
          add("普通任务", 0);
          add("高优先级", 10);
          add("超额任务", 20);
        }}
      >
        准备优先级队列
      </button>
      <button onClick={q.resume}>恢复优先级调度</button>
      <output>{log.join(" → ") || "等待运行"}</output>
      {error && <p role="alert">{error}</p>}
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label} · {t.status}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced1;
`;function m(){let e=r({concurrency:1,retry:2,retryDelay:300});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>{let t=0;e.add(async e=>{if(await i(e,100),++t<3)throw Error(`模拟暂时失败`);return`第三次成功`},`重试任务`)},children:`加入可恢复任务`}),(0,s.jsx)(`button`,{onClick:()=>e.add(async e=>(await i(e,1500),`完成`),`超时任务`,{timeout:200}),children:`加入超时任务`}),(0,s.jsx)(`button`,{onClick:e.cancelAll,children:`取消所有增强任务`}),(0,s.jsx)(`ul`,{children:e.tasks.map(e=>(0,s.jsxs)(`li`,{children:[e.label,` · `,e.status,` · 尝试 `,e.attempts,` ·`,` `,e.result??String(e.error??``)]},e.id))})]})}var h=`import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Enhanced2() {
  const q = useAsyncQueue<string>({
    concurrency: 1,
    retry: 2,
    retryDelay: 300,
  });
  return (
    <>
      <button
        onClick={() => {
          let attempt = 0;
          q.add(async (signal) => {
            await delay(signal, 100);
            if (++attempt < 3) throw Error("模拟暂时失败");
            return "第三次成功";
          }, "重试任务");
        }}
      >
        加入可恢复任务
      </button>
      <button
        onClick={() =>
          q.add(
            async (signal) => {
              await delay(signal, 1500);
              return "完成";
            },
            "超时任务",
            { timeout: 200 },
          )
        }
      >
        加入超时任务
      </button>
      <button onClick={q.cancelAll}>取消所有增强任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label} · {t.status} · 尝试 {t.attempts} ·{" "}
            {t.result ?? String(t.error ?? "")}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Enhanced2;
`;function g(){let[e,t]=o.useState([]),n=r({concurrency:2,timeout:300,retry:1,retryOnTimeout:!0});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{onClick:()=>{let e=0,{promise:r}=n.add(async n=>{let r=++e;return await i(new AbortController().signal,r===1?800:100),n.aborted&&t(e=>[...e,`第 ${r} 次尝试的迟到结果已忽略`]),`第 ${r} 次尝试成功`},`首次超时的任务`);r.then(e=>t(t=>[...t,e]),e=>t(t=>[...t,`失败：${e.name}`]))},children:`添加首次会超时的任务`}),(0,s.jsx)(`ul`,{children:n.tasks.map(e=>(0,s.jsxs)(`li`,{children:[e.label,`：`,e.status,` · 已执行 `,e.attempts,` 次`,e.status!==`queued`&&e.status!==`running`&&(0,s.jsx)(`button`,{className:`secondary`,onClick:()=>n.remove(e.id),children:`移除此记录`})]},e.id))}),(0,s.jsx)(`output`,{children:e.join(` → `)||`等待任务`})]})}var _=`import * as React from "react";

import { useAsyncQueue } from "../../../src";

import { delay } from "../../demos/webHelpers";

function Feature1() {
  const [log, setLog] = React.useState<string[]>([]);
  const q = useAsyncQueue<string>({
    concurrency: 2,
    timeout: 300,
    retry: 1,
    retryOnTimeout: true,
  });
  const add = () => {
    let attempt = 0;
    const { promise } = q.add(async (signal) => {
      const current = ++attempt;
      // The first attempt is slow and times out; it still settles later with a stale value.
      await delay(new AbortController().signal, current === 1 ? 800 : 100);
      if (signal.aborted)
        setLog((l) => [...l, \`第 \${current} 次尝试的迟到结果已忽略\`]);
      return \`第 \${current} 次尝试成功\`;
    }, "首次超时的任务");
    promise.then(
      (value) => setLog((l) => [...l, value]),
      (error: Error) => setLog((l) => [...l, \`失败：\${error.name}\`]),
    );
  };
  return (
    <>
      <button onClick={add}>添加首次会超时的任务</button>
      <ul>
        {q.tasks.map((t) => (
          <li key={t.id}>
            {t.label}：{t.status} · 已执行 {t.attempts} 次
            {t.status !== "queued" && t.status !== "running" && (
              <button className="secondary" onClick={() => q.remove(t.id)}>
                移除此记录
              </button>
            )}
          </li>
        ))}
      </ul>
      <output>{log.join(" → ") || "等待任务"}</output>
    </>
  );
}

export default Feature1;
`;function v(){return(0,s.jsxs)(`div`,{className:`additional-demos`,children:[(0,s.jsx)(e,{source:l,title:`动态并发与运行计数`,description:`新增四个任务，改变并发上限后观察等待任务的调度；降低上限不终止已运行任务。`,children:(0,s.jsx)(c,{})}),(0,s.jsx)(e,{source:d,title:`单任务失败不阻断后续`,description:`失败任务记录 error，后续任务继续运行，结束后可以清理历史。`,children:(0,s.jsx)(u,{})}),(0,s.jsx)(e,{source:p,title:`优先级与队列容量`,description:`暂停后加入普通和高优先级任务，恢复时高优先级先执行；超过容量会明确拒绝。`,children:(0,s.jsx)(f,{})}),(0,s.jsx)(e,{source:h,title:`失败重试与超时取消`,description:`前两次失败后成功；另一个任务超时后终止，不继续重试。可在退避等待中取消全部。`,children:(0,s.jsx)(m,{})}),(0,s.jsx)(e,{source:_,title:`超时重试与迟到结果`,description:`开启 retryOnTimeout 后首次超时会自动重试；被超时的旧尝试稍后返回也会被忽略，已结束记录可单独移除。`,children:(0,s.jsx)(g,{})})]})}export{v as default};