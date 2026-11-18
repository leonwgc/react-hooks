import * as React from "react";
import { useSortable } from "../../src";
import { Scenario } from "./Scenario";

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
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="禁用排序与受控数据"
        description="锁定后拖放、键盘和 move 都不会改动列表；解锁后再尝试移动。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="键盘取消与边界移动"
        description="聚焦项目后按空格拾取、方向键移动、Esc 恢复原顺序；越界 move 返回 false。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
