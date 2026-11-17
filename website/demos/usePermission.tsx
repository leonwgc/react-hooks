import { useState } from "react";
import { usePermission } from "../../src";

export default function Demo() {
  const [canEdit, setCanEdit] = useState(false);
  const permission = usePermission(
    canEdit ? ["article:read", "article:edit"] : ["article:read"],
  );
  return (
    <div className="demo-stack">
      <label className="check">
        <input
          type="checkbox"
          checked={canEdit}
          onChange={(e) => setCanEdit(e.target.checked)}
        />
        授予编辑权限
      </label>
      <button disabled={!permission.has("article:edit")}>编辑文章</button>
      <p>这里只控制界面，接口权限必须由服务端校验。</p>
    </div>
  );
}
