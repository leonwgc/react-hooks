import { useFocusWithin } from "../../../src";

function Case1() {
  const f = useFocusWithin();
  return (
    <>
      <fieldset {...f.bind}>
        <legend>组合地址</legend>
        <label>
          城市
          <input />
        </label>
        <label>
          街道
          <input />
        </label>
        {f.focused && <p>可用 Tab 在地址字段间切换。</p>}
      </fieldset>
      <button>聚焦区域外</button>
      <output>{f.focused ? "正在填写地址" : "地址区域未聚焦"}</output>
    </>
  );
}

export default Case1;
