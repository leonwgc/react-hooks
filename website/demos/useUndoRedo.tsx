import { useUndoRedo, useForm } from "../../src";
export default function Demo() {
  const history = useUndoRedo("开始编辑这段文案", { limit: 30 });
  return (
    <div className="demo-stack">
      <label>
        编辑文案
        <textarea
          value={history.value}
          onChange={(e) => history.set(e.target.value)}
        />
      </label>
      <div className="demo-row">
        <button disabled={!history.canUndo} onClick={history.undo}>
          撤销
        </button>
        <button disabled={!history.canRedo} onClick={history.redo}>
          重做
        </button>
        <button onClick={() => history.reset("开始编辑这段文案")}>
          重置历史
        </button>
      </div>
      <SnapshotForm />
      <small>保留最近 30 次不可变快照；撤销后编辑会丢弃重做分支。</small>
    </div>
  );
}

function SnapshotForm() {
  const form = useForm({ initialValues: { title: "初始标题" } });
  const history = useUndoRedo(form.values);
  return (
    <form
      className="demo-stack"
      onSubmit={(event) => {
        void form.handleSubmit((values) => {
          history.set(values);
        })(event);
      }}
    >
      <label>
        表单标题
        <input {...form.register("title")} />
      </label>
      <div className="demo-row">
        <button type="submit">保存表单快照</button>
        <button
          type="button"
          disabled={!history.canUndo}
          onClick={history.undo}
        >
          选择上一快照
        </button>
        <button type="button" onClick={() => form.reset(history.value)}>
          恢复所选快照
        </button>
      </div>
      <output>所选快照：{history.value.title}</output>
    </form>
  );
}
