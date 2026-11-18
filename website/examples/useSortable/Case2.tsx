import * as React from "react";

import { useSortable } from "../../../src";

function Case2() {
  const [items, setItems] = React.useState(["设计", "实现", "验收"]);
  const [result, setResult] = React.useState("等待移动");
  const s = useSortable(items, { getKey: (item) => item, onChange: setItems });
  return (
    <>
      <ol>
        {items.map((item) => (
          <li className="notice" key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <button
        onClick={() => setResult(s.move(0, -1) ? "移动成功" : "越界未移动")}
      >
        尝试移到负索引
      </button>
      <output>{s.announcement || result}</output>
    </>
  );
}

export default Case2;
