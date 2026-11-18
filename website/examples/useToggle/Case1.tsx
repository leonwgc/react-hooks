import { useToggle } from "../../../src";

function Case1() {
  const zoom = useToggle(100, 150);
  return (
    <>
      <button onClick={zoom.toggle}>切换缩放</button>
      <button onClick={() => zoom.setValue(100)}>恢复 100%</button>
      <output>缩放：{zoom.value}%</output>
      <p style={{ fontSize: zoom.value / 100 + "em" }}>可缩放的预览文字</p>
    </>
  );
}

export default Case1;
