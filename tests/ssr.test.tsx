// @vitest-environment node
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import * as hooks from "../src";
it("exports all public hooks and server-renders every browser-dependent hook safely", () => {
  expect(
    Object.keys(hooks).filter((name) => name.startsWith("use")),
  ).toHaveLength(57);
  function ServerExample() {
    hooks.useEventListener("click", () => {});
    hooks.useWindowSize();
    hooks.useElementSize(null);
    hooks.useIntersectionObserver(null);
    hooks.useScroll();
    hooks.useClickOutside(null, () => {});
    hooks.useKeyPress("k", () => {});
    hooks.useClipboard();
    hooks.useOnline();
    hooks.usePageVisibility();
    hooks.useCountdown(null);
    hooks.useUrlState();
    hooks.useMediaQuery("(min-width: 1px)");
    hooks.useAnimate(null);
    hooks.useRafLoop(() => {});
    hooks.useReducedMotion();
    hooks.useInterval(() => {}, 100);
    hooks.useRequest(async () => 1);
    hooks.useAsyncQueue();
    hooks.useUpload({ transport: async () => "ok" });
    hooks.useInfiniteScroll(async () => ({ items: [], nextCursor: null }), {
      initialCursor: 0,
    });
    hooks.useVirtualList([], {
      itemHeight: 20,
      height: 200,
      getKey: (_, i) => i,
    });
    hooks.useUndoRedo(0);
    hooks.useLeaveConfirm(true);
    hooks.useFocusWithin();
    hooks.useLongPress(() => {});
    hooks.useDrag("text");
    hooks.useDrop(() => {});
    hooks.useMutationObserver(null, () => {});
    hooks.useImage("/image.png");
    hooks.useFullscreen(null);
    hooks.useBroadcastChannel("test", (value) => value);
    hooks.useEventSource("/events", { parse: (value) => value });
    hooks.useTextSelection();
    hooks.useDownload();
    const storage = hooks.useLocalStorageState("ssr", "server");
    hooks.useSessionStorageState("ssr", "session");
    const form = hooks.useForm({ initialValues: { rows: ["x"] } });
    hooks.useFieldArray(form, "rows");
    return <span>{storage.value}</span>;
  }
  expect(renderToString(<ServerExample />)).toBe("<span>server</span>");
});
