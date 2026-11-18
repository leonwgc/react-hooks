import * as React from "react";
import { useDebounce } from "../../src";
import { Scenario } from "./Scenario";

function Case1() {
  const [text, setText] = React.useState("");
  const [wait, setWait] = React.useState(300);
  const value = useDebounce(text, wait);
  return (
    <>
      <label>
        预览内容
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        等待毫秒
        <select value={wait} onChange={(e) => setWait(Number(e.target.value))}>
          <option value={0}>0</option>
          <option value={300}>300</option>
          <option value={1000}>1000</option>
        </select>
      </label>
      <output>
        即时：{text} / 稳定：{value}
      </output>
    </>
  );
}
function Case2() {
  const [filters, setFilters] = React.useState({ keyword: "", limit: 10 });
  const value = useDebounce(filters, 400);
  return (
    <>
      <label>
        对象关键词
        <input
          value={filters.keyword}
          onChange={(e) =>
            setFilters((s) => ({ ...s, keyword: e.target.value }))
          }
        />
      </label>
      <button
        onClick={() =>
          setFilters((s) => ({ ...s, limit: s.limit === 10 ? 20 : 10 }))
        }
      >
        切换 10 / 20 条
      </button>
      <output>待查询条件：{JSON.stringify(value)}</output>
    </>
  );
}
export default function Examples() {
  return (
    <div className="additional-demos">
      <Scenario
        title="可调整等待时间"
        description="修改等待时间并连续输入，比较即时值与防抖值。"
      >
        <Case1 />
      </Scenario>
      <Scenario
        title="对象条件合并查询"
        description="多个条件组成同一个对象，停止修改后一起成为查询快照。"
      >
        <Case2 />
      </Scenario>
    </div>
  );
}
