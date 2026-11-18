var e=`import * as React from "react";
import { createQueryStore, useQuery } from "../../src";
import { Scenario } from "./Scenario";
import { delay } from "../demos/webHelpers";
function Case1() {
  const [store] = React.useState(() => {
    let calls = 0;
    return createQueryStore(
      async ({ signal }, key: string) => {
        await delay(signal, 100);
        return \`\${key} / 请求 \${++calls}\`;
      },
      { staleTime: Infinity },
    );
  });
  const [key, setKey] = React.useState<string | null>("A");
  const q = useQuery(store, key);
  return (
    <>
      <button onClick={() => setKey("A")}>查看缓存 A</button>
      <button onClick={() => setKey("B")}>查看缓存 B</button>
      <button onClick={() => setKey(null)}>停止查询订阅</button>
      <output>{q.data ?? q.status}</output>
    </>
  );
}
function Case2() {
  const fail = React.useRef(true);
  const [store] = React.useState(() =>
    createQueryStore(async ({ signal }) => {
      await delay(signal, 300);
      if (fail.current) throw Error("模拟缓存请求失败");
      return "查询已恢复";
    }),
  );
  const q = useQuery(store, "manual", { enabled: false });
  return (
    <>
      <button onClick={() => void q.refetch().catch(() => {})}>
        手动获取缓存数据
      </button>
      <button
        onClick={() => {
          fail.current = false;
          void q.refetch().catch(() => {});
        }}
      >
        关闭失败并重试
      </button>
      <button onClick={q.cancel}>取消共享请求</button>
      <output>{q.data ?? q.status}</output>
      {!!q.error && <p role="alert">{String(q.error)}</p>}
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="缓存键切换与复用"
        description="A、B 使用不同缓存项，再次切回 A 会复用新鲜数据；null 暂停订阅。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="手动查询与错误恢复"
        description="enabled 为 false 时不自动请求；失败后显式重试，并可取消正在进行的请求。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};