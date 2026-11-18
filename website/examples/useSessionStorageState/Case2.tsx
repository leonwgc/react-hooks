import { useSessionStorageState } from "../../../src";

function Case2() {
  const a = useSessionStorageState(
    "web-hooks:examples:useSessionStorageState:shared",
    0,
  );
  const b = useSessionStorageState(
    "web-hooks:examples:useSessionStorageState:shared",
    0,
  );
  return (
    <>
      <button onClick={() => a.setValue((n) => n + 1)}>从实例 A 加一</button>
      <button onClick={() => b.setValue((n) => n + 10)}>从实例 B 加十</button>
      <button onClick={a.remove}>清除共享值</button>
      <output>
        A {a.value} · B {b.value}
      </output>
    </>
  );
}

export default Case2;
