// @vitest-environment node
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import * as hooks from "../src";
it("exports exactly forty hooks and server-renders every browser-dependent hook safely", () => {
  expect(
    Object.keys(hooks).filter((name) => name.startsWith("use")),
  ).toHaveLength(40);
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
    const storage = hooks.useLocalStorageState("ssr", "server");
    hooks.useSessionStorageState("ssr", "session");
    const form = hooks.useForm({ initialValues: { rows: ["x"] } });
    hooks.useFieldArray(form, "rows");
    return <span>{storage.value}</span>;
  }
  expect(renderToString(<ServerExample />)).toBe("<span>server</span>");
});
