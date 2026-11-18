import * as React from "react";

import { useOnline } from "../../../src";

function Case1() {
  const online = useOnline();
  const [draft, setDraft] = React.useState("");
  const [saved, setSaved] = React.useState("尚未提交");
  return (
    <>
      <label>
        离线草稿
        <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button disabled={!online} onClick={() => setSaved(draft || "空草稿")}>
        模拟提交草稿
      </button>
      <output>
        {online ? "允许提交" : "离线，草稿仍可编辑"} · {saved}
      </output>
    </>
  );
}

export default Case1;
