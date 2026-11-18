import * as React from "react";

import { useSortable } from "../../../src";

function Case1() {
  const [items, setItems] = React.useState(["第一项", "第二项", "第三项"]);
  const [disabled, setDisabled] = React.useState(true);
  const s = useSortable(items, {
    getKey: (item) => item,
    onChange: setItems,
    disabled,
  });
  return (
    <>
      <button onClick={() => setDisabled((v) => !v)}>
        {disabled ? "解锁排序" : "锁定排序"}
      </button>
      <button onClick={() => s.move(0, 2)}>把首项移至末尾</button>
      <ol>
        {items.map((item) => (
          <li key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <output>{disabled ? "排序已锁定" : s.announcement || "可以排序"}</output>
    </>
  );
}

export default Case1;
