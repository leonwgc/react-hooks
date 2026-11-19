import * as React from "react";

import { useForm } from "../../../src";

function Editor() {
  const form = useForm({
    initialValues: { title: "", content: "", password: "" },
    persist: { key: "demo-form-draft", debounce: 300, exclude: ["password"] },
  });
  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <label>
        标题
        <input {...form.register("title")} />
      </label>
      <label>
        正文
        <textarea {...form.register("content")} />
      </label>
      <label>
        发布密码（exclude，不会保存）
        <input type="password" {...form.register("password")} />
      </label>
      <button type="submit">发布（成功后清除草稿）</button>
      <output>
        已修改：{Object.keys(form.dirtyFields).join("、") || "无"}
      </output>
    </form>
  );
}

function Feature8() {
  const [mounted, setMounted] = React.useState(true);
  return (
    <>
      <button onClick={() => setMounted((v) => !v)}>
        {mounted ? "关闭编辑器（模拟离开页面）" : "重新打开编辑器"}
      </button>
      {mounted ? (
        <Editor />
      ) : (
        <p>编辑器已关闭；重新打开会恢复草稿（密码除外）。</p>
      )}
      <button
        className="secondary"
        onClick={() => localStorage.removeItem("demo-form-draft")}
      >
        清除已保存的草稿
      </button>
    </>
  );
}

export default Feature8;
