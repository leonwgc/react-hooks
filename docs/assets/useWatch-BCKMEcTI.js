import{t as e}from"./Scenario-lI9aBaLE.js";import{r as t,t as n}from"./react-DvXU6kJ2.js";import{i as r,n as i,r as a}from"./form-BPPkl8Rn.js";import{D as o}from"./index-BH-UjxLV.js";var s=t(n(),1),c=o(),l=s.memo(function({control:e}){let t=a(e,`address`);return(0,c.jsxs)(`label`,{children:[`收货地址`,(0,c.jsx)(`input`,{value:t.value,onChange:e=>t.setValue(e.target.value)})]})}),u=s.memo(function({control:e}){let t=r(e,`method`),n=s.useRef(0);return n.current++,(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`output`,{children:[`条件区域渲染 `,n.current,` 次`]}),t===`express`&&(0,c.jsx)(l,{control:e})]})});function d(){let e=i({initialValues:{method:`pickup`,address:``,note:``}});return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{onClick:()=>e.setFieldValue(`method`,`express`),children:`切换为快递配送`}),(0,c.jsxs)(`label`,{className:`check`,children:[(0,c.jsx)(`input`,{type:`radio`,...e.register(`method`,{value:`pickup`})}),`到店自取`]}),(0,c.jsxs)(`label`,{className:`check`,children:[(0,c.jsx)(`input`,{type:`radio`,...e.register(`method`,{value:`express`})}),`快递配送`]}),(0,c.jsxs)(`label`,{children:[`备注（不会触发条件区域渲染）`,(0,c.jsx)(`input`,{...e.register(`note`)})]}),(0,c.jsx)(u,{control:e.control})]})}var f=`import * as React from "react";

import {
  useForm,
  useFormField,
  useWatch,
  type FormControl,
} from "../../../src";

type Shipping = { method: "pickup" | "express"; address: string; note: string };

const AddressInput = React.memo(function AddressInput({
  control,
}: {
  control: FormControl<Shipping>;
}) {
  const field = useFormField(control, "address");
  return (
    <label>
      收货地址
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const AddressSection = React.memo(function AddressSection({
  control,
}: {
  control: FormControl<Shipping>;
}) {
  const method = useWatch(control, "method");
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <output>条件区域渲染 {renders.current} 次</output>
      {method === "express" && <AddressInput control={control} />}
    </>
  );
});

function Case1() {
  const form = useForm<Shipping>({
    initialValues: { method: "pickup", address: "", note: "" },
  });
  return (
    <>
      <button onClick={() => form.setFieldValue("method", "express")}>
        切换为快递配送
      </button>
      <label className="check">
        <input type="radio" {...form.register("method", { value: "pickup" })} />
        到店自取
      </label>
      <label className="check">
        <input
          type="radio"
          {...form.register("method", { value: "express" })}
        />
        快递配送
      </label>
      <label>
        备注（不会触发条件区域渲染）
        <input {...form.register("note")} />
      </label>
      <AddressSection control={form.control} />
    </>
  );
}

export default Case1;
`,p=s.memo(function({control:e}){let t=a(e,`name`);return(0,c.jsxs)(`label`,{children:[`收件人`,(0,c.jsx)(`input`,{value:t.value,onChange:e=>t.setValue(e.target.value)})]})}),m=s.memo(function({control:e}){let t=r(e);return(0,c.jsx)(`pre`,{children:`收件人：${t.name||`（未填写）`}\n尺码：${t.size}\n礼品包装：${t.gift?`是`:`否`}`})});function h(){let e=i({initialValues:{name:``,size:`M`,gift:!1}}),t=s.useRef(0);return t.current++,(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`button`,{onClick:()=>e.setFieldValue(`gift`,!0),children:`添加礼品包装`}),(0,c.jsx)(p,{control:e.control}),(0,c.jsx)(m,{control:e.control}),(0,c.jsxs)(`output`,{children:[`表单根组件渲染 `,t.current,` 次`]})]})}var g=`import * as React from "react";

import {
  useFormField,
  useForm,
  useWatch,
  type FormControl,
} from "../../../src";

type Order = { name: string; size: "S" | "M" | "L"; gift: boolean };

const NameField = React.memo(function NameField({
  control,
}: {
  control: FormControl<Order>;
}) {
  const field = useFormField(control, "name");
  return (
    <label>
      收件人
      <input
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
      />
    </label>
  );
});

const Preview = React.memo(function Preview({
  control,
}: {
  control: FormControl<Order>;
}) {
  const order = useWatch(control);
  return (
    <pre>
      {\`收件人：\${order.name || "（未填写）"}\\n尺码：\${order.size}\\n礼品包装：\${order.gift ? "是" : "否"}\`}
    </pre>
  );
});

function Case2() {
  const form = useForm<Order>({
    initialValues: { name: "", size: "M", gift: false },
  });
  const renders = React.useRef(0);
  renders.current++;
  return (
    <>
      <button onClick={() => form.setFieldValue("gift", true)}>
        添加礼品包装
      </button>
      <NameField control={form.control} />
      <Preview control={form.control} />
      <output>表单根组件渲染 {renders.current} 次</output>
    </>
  );
}

export default Case2;
`;function _(){return(0,c.jsxs)(`div`,{className:`additional-demos`,children:[(0,c.jsx)(e,{source:f,title:`条件显示与渲染计数`,description:`只订阅配送方式，选择快递时才显示地址字段；修改备注不会让条件区域重渲染。`,children:(0,c.jsx)(d,{})}),(0,c.jsx)(e,{source:g,title:`订阅整个表单生成预览`,description:`省略 path 订阅全部值，实时生成订单摘要；表单根组件本身保持不重渲染。`,children:(0,c.jsx)(h,{})})]})}export{_ as default};