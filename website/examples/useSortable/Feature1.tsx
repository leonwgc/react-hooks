import * as React from "react";

import { useSortable } from "../../../src";

function Feature1() {
  const [items, setItems] = React.useState(["Design", "Build", "Ship"]);
  const s = useSortable(items, {
    getKey: (item) => item,
    onChange: setItems,
    messages: {
      roleDescription: "sortable item",
      picked: (position) =>
        `Picked up item ${position}. Use arrow keys to move.`,
      moved: (position, total) => `Moved to position ${position} of ${total}.`,
      finished: "Reordering finished.",
      cancelled: "Reordering cancelled.",
    },
  });
  return (
    <>
      <button>Focus target outside the list</button>
      <ol>
        {items.map((item) => (
          <li className="notice" key={item} {...s.getItemProps(item)}>
            {item}
          </li>
        ))}
      </ol>
      <p>
        Focus an item, press Space and an arrow key, then press Tab: moving
        focus away cancels and restores the original order.
      </p>
      <output role="status">{s.announcement || "Waiting"}</output>
    </>
  );
}

export default Feature1;
