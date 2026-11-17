import { useEffect, useRef } from "react";
import { useDisclosure } from "../../src";
export default function Demo() {
  const disclosure = useDisclosure();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (disclosure.isOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [disclosure.isOpen]);
  return (
    <div>
      <button onClick={disclosure.open}>打开对话框</button>
      <dialog
        ref={dialog}
        onCancel={disclosure.close}
        onClose={disclosure.close}
        aria-labelledby="disclosure-title"
      >
        <h3 id="disclosure-title">专注内容，简化交互</h3>
        <p>原生 dialog 提供焦点管理。按 Esc 或点击按钮关闭。</p>
        <button onClick={disclosure.close}>完成</button>
      </dialog>
    </div>
  );
}
