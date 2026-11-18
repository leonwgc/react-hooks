import{t as e}from"./Scenario-B54Ff5d8.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{t as r}from"./motion-CbR3Bpc6.js";import{D as i}from"./index-DcZxIQAI.js";var a=t(n(),1),o=i();function s(){let[e,t]=a.useState(0),[n,i]=a.useState(10),s=r(e,{damping:n});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`label`,{children:[`弹簧阻尼`,(0,o.jsx)(`input`,{type:`range`,min:5,max:40,value:n,onChange:e=>i(Number(e.target.value))})]}),(0,o.jsx)(`button`,{onClick:()=>t(e=>e===0?100:0),children:`改变物理目标`}),(0,o.jsx)(`div`,{className:`animation-stage`,children:(0,o.jsx)(`div`,{className:`animation-orb`,style:{transform:`translateX(${s.value}px)`},children:`S`})}),(0,o.jsxs)(`output`,{children:[`值 `,s.value.toFixed(1),` · 速度 `,s.velocity.toFixed(1),`/s`]})]})}var c=`import * as React from "react";

import { useSpring } from "../../../src";

function Case1() {
  const [target, setTarget] = React.useState(0);
  const [damping, setDamping] = React.useState(10);
  const s = useSpring(target, { damping });
  return (
    <>
      <label>
        弹簧阻尼
        <input
          type="range"
          min={5}
          max={40}
          value={damping}
          onChange={(e) => setDamping(Number(e.target.value))}
        />
      </label>
      <button onClick={() => setTarget((t) => (t === 0 ? 100 : 0))}>
        改变物理目标
      </button>
      <div className="animation-stage">
        <div
          className="animation-orb"
          style={{ transform: \`translateX(\${s.value}px)\` }}
        >
          S
        </div>
      </div>
      <output>
        值 {s.value.toFixed(1)} · 速度 {s.velocity.toFixed(1)}/s
      </output>
    </>
  );
}

export default Case1;
`;function l(){let[e,t]=a.useState(0),n=r(e,{stiffness:35,damping:8});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(`button`,{onClick:()=>t(100),children:`开始慢速弹簧`}),(0,o.jsx)(`button`,{onClick:n.stop,children:`暂停弹簧`}),(0,o.jsx)(`button`,{onClick:n.restart,children:`继续弹簧`}),(0,o.jsx)(`button`,{onClick:n.finish,children:`吸附到目标`}),(0,o.jsxs)(`output`,{children:[n.value.toFixed(1),` · `,n.animating?`动画中`:`停止`]})]})}var u=`import * as React from "react";

import { useSpring } from "../../../src";

function Case2() {
  const [target, setTarget] = React.useState(0);
  const s = useSpring(target, { stiffness: 35, damping: 8 });
  return (
    <>
      <button onClick={() => setTarget(100)}>开始慢速弹簧</button>
      <button onClick={s.stop}>暂停弹簧</button>
      <button onClick={s.restart}>继续弹簧</button>
      <button onClick={s.finish}>吸附到目标</button>
      <output>
        {s.value.toFixed(1)} · {s.animating ? "动画中" : "停止"}
      </output>
    </>
  );
}

export default Case2;
`;function d(){return(0,o.jsxs)(`div`,{className:`additional-demos`,children:[(0,o.jsx)(e,{source:c,title:`调整阻尼观察回弹`,description:`低阻尼会有更明显回弹；高阻尼更平缓，系统减少动态效果时直接到达目标。`,children:(0,o.jsx)(s,{})}),(0,o.jsx)(e,{source:u,title:`暂停、继续与立即到达`,description:`暂停保留当前值；restart 从当前位置继续追踪目标，finish 直接吸附。`,children:(0,o.jsx)(l,{})})]})}export{d as default};