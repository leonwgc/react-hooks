import * as React from "react";

import { useForm } from "../../../src";

import { delay } from "../../demos/webHelpers";

let version = 0;
const fetchProfile = async (signal: AbortSignal) => {
  await delay(signal, 600);
  version++;
  return {
    nickname: `服务端昵称 v${version}`,
    bio: `第 ${version} 次加载的简介`,
  };
};

function Feature5() {
  const form = useForm({
    initialValues: { nickname: "", bio: "" },
    loadValues: ({ signal }) => fetchProfile(signal),
  });
  return (
    <>
      <button onClick={form.reloadValues} disabled={form.isLoading}>
        重新加载服务端数据
      </button>
      {form.isLoading ? (
        <output>加载中…</output>
      ) : (
        <>
          <label>
            昵称
            <input {...form.register("nickname")} />
          </label>
          <label>
            简介
            <input {...form.register("bio")} />
          </label>
          <output>
            isDirty：{String(form.isDirty)} · 已修改：
            {Object.keys(form.dirtyFields).join("、") || "无"}
          </output>
        </>
      )}
    </>
  );
}

export default Feature5;
