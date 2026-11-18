var e=`import * as React from "react";
import { useDebounceFn } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [text, setText] = React.useState("");
  const [saved, setSaved] = React.useState("未保存");
  const save = useDebounceFn(
    (value: string) => setSaved(value || "空草稿"),
    600,
  );
  return (
    <>
      <label>
        自动保存草稿
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            save.run(e.target.value);
          }}
        />
      </label>
      <button onClick={() => save.flush()}>立即保存草稿</button>
      <button onClick={save.cancel}>取消待保存</button>
      <output>已保存：{saved}</output>
    </>
  );
}
function Case2() {
  const [result, setResult] = React.useState("无");
  const action = useDebounceFn((value: string) => {
    setResult(value);
    return value;
  }, 800);
  return (
    <>
      <button
        onClick={() => {
          action.run("A");
          action.run("B");
          action.run("C");
        }}
      >
        连续提交 A / B / C
      </button>
      <button onClick={() => action.flush()}>立即处理最后一项</button>
      <button onClick={action.cancel}>撤销待处理项</button>
      <output>处理结果：{result}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="草稿自动保存"
        description="输入持续重启等待，手动保存调用 flush，撤销待保存调用 cancel。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="只保留最后一组参数"
        description="依次传入 A、B、C；等待结束或立即执行只会处理最后一次参数。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
`;export{e as default};