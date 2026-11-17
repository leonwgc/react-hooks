import { useControllableState } from "../../src";

export default function Demo() {
  const [value, setValue] = useControllableState({ defaultValue: 3 });
  return (
    <div className="demo-row">
      <button onClick={() => setValue((n) => n - 1)}>−</button>
      <output aria-label="数量">{value}</output>
      <button onClick={() => setValue((n) => n + 1)}>+</button>
    </div>
  );
}
