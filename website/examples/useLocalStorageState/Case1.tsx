import { useLocalStorageState } from "../../../src";

function Case1() {
  const s = useLocalStorageState(
    "web-hooks:examples:useLocalStorageState:object",
    { count: 0, name: "访客" },
  );
  return (
    <>
      <button onClick={() => s.setValue((v) => ({ ...v, count: v.count + 1 }))}>
        增加持久计数
      </button>
      <button onClick={s.remove}>清除对象记录</button>
      <output>{JSON.stringify(s.value)}</output>
      {!!s.error && <p role="alert">{String(s.error)}</p>}
    </>
  );
}

export default Case1;
