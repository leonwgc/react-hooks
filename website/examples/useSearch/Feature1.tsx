import * as React from "react";

import { useSearch } from "../../../src";

type Filters = { keyword: string; status?: string; owner?: string };

function Feature1() {
  const s = useSearch<Filters>({ keyword: "" });
  const preset: Filters = { keyword: "发布" };
  return (
    <>
      <button onClick={() => s.setDraft({ status: "open", owner: "我" })}>
        添加状态和负责人条件
      </button>
      <button onClick={() => s.setDraft(preset)}>setDraft 合并预设</button>
      <button onClick={() => s.replaceDraft(preset)}>
        replaceDraft 整体替换
      </button>
      <button className="secondary" onClick={s.submit}>
        提交
      </button>
      <output>草稿：{JSON.stringify(s.draft)}</output>
      <output>已提交：{JSON.stringify(s.submitted)}</output>
    </>
  );
}

export default Feature1;
