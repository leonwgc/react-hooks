import { useFieldArray, useForm } from "../../../src";

function Case1() {
  const f = useForm({ initialValues: { tags: ["React"] } });
  const a = useFieldArray(f, "tags");
  return (
    <>
      <div>
        {a.fields.map((field, i) => (
          <div className="demo-row" key={field.id}>
            <label>
              标签 {i + 1}
              <input {...f.register(`tags.${i}`)} />
            </label>
            <button onClick={() => a.remove(i)}>删除标签 {i + 1}</button>
          </div>
        ))}
      </div>
      <button onClick={() => a.append("新标签")}>追加标签</button>
      <output>{JSON.stringify(f.values.tags)}</output>
    </>
  );
}

export default Case1;
