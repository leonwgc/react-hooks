import { useSetState } from "../../src";

export default function Demo() {
  const [state, setState] = useSetState({ name: "访客", visits: 0 });
  return (
    <div className="demo-stack">
      <label>
        昵称
        <input
          value={state.name}
          onChange={(e) => setState({ name: e.target.value })}
        />
      </label>
      <button onClick={() => setState((s) => ({ visits: s.visits + 1 }))}>
        记录访问
      </button>
      <output>
        {state.name} 已访问 {state.visits} 次
      </output>
    </div>
  );
}
