import { useState } from "react";
import { useDrop, useDrag } from "../../src";
export default function Demo() {
  const [value, setValue] = useState("等待文件或文本");
  const drop = useDrop(({ files, text }) =>
    setValue(files.length ? files.map((file) => file.name).join("、") : text),
  );
  const drag = useDrag("一段可拖放的文本");
  return (
    <div className="demo-stack">
      <div {...drag.bind}>拖动这段文本</div>
      <div {...drop.bind} className="notice">
        {drop.over ? "松开放置" : value}
        <p>拖入文本或文件，本示例仅显示名称。</p>
        <label>
          或选择文件
          <input
            type="file"
            multiple
            onChange={(e) =>
              setValue(
                Array.from(e.target.files ?? [], (file) => file.name).join(
                  "、",
                ),
              )
            }
          />
        </label>
      </div>
    </div>
  );
}
