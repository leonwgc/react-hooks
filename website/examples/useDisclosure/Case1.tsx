import { useDisclosure } from "../../../src";

function Case1() {
  const panel = useDisclosure(true);
  return (
    <>
      <button onClick={panel.toggle} aria-expanded={panel.isOpen}>
        切换帮助内容
      </button>
      <button onClick={panel.open}>始终展开</button>
      {panel.isOpen && <p className="notice">这里是帮助说明。</p>}
      <output>{panel.isOpen ? "展开" : "收起"}</output>
    </>
  );
}

export default Case1;
