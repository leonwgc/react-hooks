import { useDisclosure } from "../../../src";

function Case2() {
  const a = useDisclosure();
  const b = useDisclosure();
  return (
    <>
      <button
        onClick={() => {
          a.open();
          b.close();
        }}
      >
        查看规格
      </button>
      <button
        onClick={() => {
          b.open();
          a.close();
        }}
      >
        查看配送
      </button>
      <button
        onClick={() => {
          a.close();
          b.close();
        }}
      >
        关闭全部面板
      </button>
      {a.isOpen && <p>规格：轻量便携</p>}
      {b.isOpen && <p>配送：次日发货</p>}
    </>
  );
}

export default Case2;
