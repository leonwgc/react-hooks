import * as React from "react";

import { useForm } from "../../../src";

function Feature6() {
  const [server, setServer] = React.useState({
    title: "周报 v1",
    status: "草稿",
  });
  const form = useForm({
    initialValues: server,
    values: server,
    resetOptions: { keepDirtyValues: true },
  });
  return (
    <>
      <button
        onClick={() =>
          setServer((s) => ({
            title: `周报 v${Number(s.title.slice(4)) + 1}`,
            status: s.status === "草稿" ? "已审核" : "草稿",
          }))
        }
      >
        模拟服务端推送新数据
      </button>
      <label>
        标题（先修改它，再推送新数据）
        <input {...form.register("title")} />
      </label>
      <label>
        状态
        <input {...form.register("status")} />
      </label>
      <output>
        服务端：{server.title} / {server.status} · 本地已修改：
        {Object.keys(form.dirtyFields).join("、") || "无"}
      </output>
    </>
  );
}

export default Feature6;
