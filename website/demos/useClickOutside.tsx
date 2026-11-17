import { useRef, useState } from "react";
import { useClickOutside } from "../../src";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="demo-stack">
      <button onClick={() => setOpen((v) => !v)}>切换菜单</button>
      {open && (
        <div className="notice">菜单已展开。点击按钮区域外部即可关闭。</div>
      )}
    </div>
  );
}
