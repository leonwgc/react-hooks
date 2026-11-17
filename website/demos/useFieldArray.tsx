import { useForm, useFieldArray } from "../../src";
export default function Demo() {
  const form = useForm({
    initialValues: { contacts: [{ name: "林一", email: "lin@example.com" }] },
  });
  const contacts = useFieldArray(form, "contacts");
  return (
    <div className="demo-stack">
      {contacts.fields.map((field, index) => (
        <div className="field-row" key={field.id}>
          <label>
            联系人 {index + 1}
            <input {...form.register(`contacts.${index}.name`)} />
          </label>
          <label>
            邮箱
            <input {...form.register(`contacts.${index}.email`)} type="email" />
          </label>
          <button
            className="secondary"
            disabled={index === 0}
            onClick={() => contacts.move(index, index - 1)}
            aria-label={`上移联系人 ${index + 1}`}
          >
            ↑
          </button>
          <button
            className="secondary"
            onClick={() => contacts.remove(index)}
            aria-label={`删除联系人 ${index + 1}`}
          >
            删除
          </button>
        </div>
      ))}
      <div className="demo-row">
        <button onClick={() => contacts.append({ name: "", email: "" })}>
          添加联系人
        </button>
        <button className="secondary" onClick={() => form.reset()}>
          重置
        </button>
      </div>
      <output>共 {contacts.fields.length} 位联系人 · 每行使用稳定 ID</output>
    </div>
  );
}
