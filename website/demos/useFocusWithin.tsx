import { useFocusWithin } from "../../src";
export default function Demo() {
  const focus = useFocusWithin();
  return (
    <div className="demo-stack">
      <div {...focus.bind} className="notice">
        <label>
          名称
          <input placeholder="点击或 Tab 聚焦" />
        </label>
        <button>区域内另一个控件</button>
      </div>
      <output>{focus.focused ? "焦点在区域内" : "焦点在区域外"}</output>
      <button>区域外按钮</button>
    </div>
  );
}
