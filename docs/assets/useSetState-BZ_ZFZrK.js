import{t as e}from"./Scenario-ApRSINdu.js";import{D as t,w as n}from"./index-C6jdXK2z.js";var r=t();function i(){let[e,t]=n({keyword:``,status:`全部`});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(`label`,{children:[`筛选关键词`,(0,r.jsx)(`input`,{value:e.keyword,onChange:e=>t({keyword:e.target.value})})]}),(0,r.jsxs)(`label`,{children:[`发布状态`,(0,r.jsxs)(`select`,{value:e.status,onChange:e=>t({status:e.target.value}),children:[(0,r.jsx)(`option`,{children:`全部`}),(0,r.jsx)(`option`,{children:`已发布`})]})]}),(0,r.jsx)(`button`,{onClick:()=>t({keyword:`React`,status:`已发布`}),children:`应用推荐筛选`}),(0,r.jsx)(`output`,{children:JSON.stringify(e)})]})}var a=`import { useSetState } from "../../../src";

function Case1() {
  const [state, set] = useSetState({ keyword: "", status: "全部" });
  return (
    <>
      <label>
        筛选关键词
        <input
          value={state.keyword}
          onChange={(e) => set({ keyword: e.target.value })}
        />
      </label>
      <label>
        发布状态
        <select
          value={state.status}
          onChange={(e) => set({ status: e.target.value })}
        >
          <option>全部</option>
          <option>已发布</option>
        </select>
      </label>
      <button onClick={() => set({ keyword: "React", status: "已发布" })}>
        应用推荐筛选
      </button>
      <output>{JSON.stringify(state)}</output>
    </>
  );
}

export default Case1;
`;function o(){let[e,t]=n(()=>({profile:{name:`小林`,city:`上海`},count:0}));return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(`button`,{onClick:()=>t(e=>({profile:{...e.profile,city:e.profile.city===`上海`?`杭州`:`上海`}})),children:`切换城市并保留姓名`}),(0,r.jsx)(`button`,{onClick:()=>{t(e=>({count:e.count+1})),t(e=>({count:e.count+1}))},children:`连续加两次`}),(0,r.jsxs)(`output`,{children:[e.profile.name,` · `,e.profile.city,` · 计数 `,e.count]})]})}var s=`import { useSetState } from "../../../src";

function Case2() {
  const [state, set] = useSetState(() => ({
    profile: { name: "小林", city: "上海" },
    count: 0,
  }));
  return (
    <>
      <button
        onClick={() =>
          set((s) => ({
            profile: {
              ...s.profile,
              city: s.profile.city === "上海" ? "杭州" : "上海",
            },
          }))
        }
      >
        切换城市并保留姓名
      </button>
      <button
        onClick={() => {
          set((s) => ({ count: s.count + 1 }));
          set((s) => ({ count: s.count + 1 }));
        }}
      >
        连续加两次
      </button>
      <output>
        {state.profile.name} · {state.profile.city} · 计数 {state.count}
      </output>
    </>
  );
}

export default Case2;
`;function c(){return(0,r.jsxs)(`div`,{className:`additional-demos`,children:[(0,r.jsx)(e,{source:a,title:`多字段筛选条件`,description:`修改一个字段会保留其他字段，支持一次提交多个字段。`,children:(0,r.jsx)(i,{})}),(0,r.jsx)(e,{source:s,title:`嵌套对象与连续更新`,description:`显式复制嵌套结构；连续两次函数更新会基于前一次结果累计。`,children:(0,r.jsx)(o,{})})]})}export{c as default};