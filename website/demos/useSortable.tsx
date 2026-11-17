import { useState } from "react";
import { useSortable } from "../../src";
const initial = [
  { id: "a", title: "需求分析" },
  { id: "b", title: "交互设计" },
  { id: "c", title: "开发实现" },
  { id: "d", title: "发布验证" },
];
export default function Demo() {
  const [items, setItems] = useState(initial);
  const sort = useSortable(items, {
    getKey: (item) => item.id,
    onChange: setItems,
  });
  return (
    <div className="demo-stack">
      <p id="sort-instructions">
        拖动项目，或 Tab 聚焦后按空格拾取、方向键移动、Enter 放下、Esc 取消。
      </p>
      <ol className="sortable-demo" aria-describedby="sort-instructions">
        {items.map((item, index) => (
          <li
            key={item.id}
            {...sort.getItemProps(item)}
            aria-label={item.title}
          >
            <span>⠿ {item.title}</span>
            <span>
              <button
                aria-label={`${item.title} 上移`}
                disabled={!index}
                onClick={() => sort.move(index, index - 1)}
              >
                ↑
              </button>
              <button
                aria-label={`${item.title} 下移`}
                disabled={index === items.length - 1}
                onClick={() => sort.move(index, index + 1)}
              >
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      <output role="status">{sort.announcement || "尚未排序"}</output>
      <button onClick={() => setItems(initial)}>恢复初始顺序</button>
    </div>
  );
}
