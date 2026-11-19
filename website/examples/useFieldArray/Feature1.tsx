import * as React from "react";

import { useFieldArray, useForm } from "../../../src";

type Member = { id: string; name: string; email: string };
let next = 3;

function Feature1() {
  const form = useForm<{ members: Member[] }>({
    initialValues: {
      members: [
        { id: "m1", name: "Ada", email: "ada@example.com" },
        { id: "m2", name: "", email: "" },
      ],
    },
    validators: {
      "members.*.name": (value) => (value ? undefined : "请填写姓名"),
      "members.*.email": (value) =>
        typeof value === "string" && value.includes("@")
          ? undefined
          : "邮箱格式不正确",
    },
  });
  const members = useFieldArray(form, "members", {
    getKey: (member) => member.id,
    rules: {
      minLength: { value: 2, message: "至少保留 2 名成员" },
      maxLength: { value: 4, message: "最多 4 名成员" },
    },
  });
  return (
    <>
      <button onClick={() => void form.validate()}>校验全部成员</button>
      <button
        className="secondary"
        onClick={() =>
          members.append({ id: `m${next++}`, name: "", email: "" })
        }
      >
        添加成员
      </button>
      <button
        className="secondary"
        onClick={() =>
          form.setValues((v) => ({ members: [...v.members].reverse() }))
        }
      >
        外部 setValues 反转顺序（key 仍跟随记录）
      </button>
      <small>{form.errors.members}</small>
      {members.fields.map((field, index) => (
        <fieldset key={field.id}>
          <legend>
            #{index + 1} · key {field.id}
          </legend>
          <label>
            姓名
            <input {...form.register(`members.${index}.name`)} />
          </label>
          <small>{form.errors[`members.${index}.name`]}</small>
          <label>
            邮箱
            <input {...form.register(`members.${index}.email`)} />
          </label>
          <small>{form.errors[`members.${index}.email`]}</small>
          <button className="secondary" onClick={() => members.remove(index)}>
            删除
          </button>
        </fieldset>
      ))}
    </>
  );
}

export default Feature1;
