import { useFocusWithin } from "../../../src";

function Case2() {
  const a = useFocusWithin();
  const b = useFocusWithin();
  return (
    <>
      <div {...a.bind}>
        <label>
          主标题
          <input />
        </label>
        <output>主区域：{String(a.focused)}</output>
      </div>
      <div {...b.bind}>
        <label>
          副标题
          <input />
        </label>
        <output>副区域：{String(b.focused)}</output>
      </div>
    </>
  );
}

export default Case2;
