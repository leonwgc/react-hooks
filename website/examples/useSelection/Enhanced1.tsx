import { useSelection } from "../../../src";

function Enhanced1() {
  const keys = ["A", "B", "C", "D", "E"],
    s = useSelection(keys, { disabledKeys: ["C"] });
  return (
    <>
      <div className="demo-row">
        {keys.map((key) => (
          <button
            key={key}
            disabled={s.isDisabled(key)}
            aria-pressed={s.isSelected(key)}
            onClick={(e) => s.toggle(key, { range: e.shiftKey })}
          >
            {key}
          </button>
        ))}
      </div>
      <button onClick={() => s.selectRange("A", "E")}>选择 A 到 E</button>
      <button onClick={s.clear}>清空范围选择</button>
      <output>已选 {s.selectedKeys.join(",") || "无"}</output>
    </>
  );
}

export default Enhanced1;
