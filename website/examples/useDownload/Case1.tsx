import * as React from "react";

import { useDownload } from "../../../src";

function Case1() {
  const [count, setCount] = React.useState(1);
  const d = useDownload();
  return (
    <>
      <label>
        报表数量
        <input
          type="number"
          min={1}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() =>
          void d
            .download(
              new Blob(["﻿名称,数量\nHooks," + count], {
                type: "text/csv;charset=utf-8",
              }),
              "hooks-report.csv",
            )
            .catch(() => {})
        }
      >
        下载 CSV 报表
      </button>
      {!!d.error && <p role="alert">{String(d.error)}</p>}
    </>
  );
}

export default Case1;
