import type { HookName } from "../catalog";
import type { ApiDoc } from "./types";

export const returnKinds = {
  useQuery: "object",
  useSteps: "object",
  useDocumentTitle: "void",
  useObjectURL: "object",
  useTextareaAutoSize: "object",
  useSpring: "object",
  useTransitionState: "object",
  useGesture: "object",

  useAnimate: "object",
  useAsyncAction: "object",
  useAsyncQueue: "object",
  useBoolean: "object",
  useBroadcastChannel: "object",
  useClickOutside: "void",
  useClipboard: "object",
  useControllableState: "tuple",
  useCountdown: "object",
  useDebounce: "value",
  useDebounceFn: "object",
  useDirty: "object",
  useDisclosure: "object",
  useDownload: "object",
  useDrag: "object",
  useDrop: "object",
  useEditor: "object",
  useElementSize: "object",
  useEventListener: "void",
  useEventSource: "object",
  useFieldArray: "object",
  useFocusWithin: "object",
  useForm: "object",
  useFormField: "object",
  useFullscreen: "object",
  useImage: "object",
  useInfiniteScroll: "object",
  useIntersectionObserver: "value",
  useInterval: "void",
  useKeyPress: "void",
  useLatest: "object",
  useLeaveConfirm: "object",
  useLocalStorageState: "object",
  useLongPress: "object",
  useMediaQuery: "value",
  useMemoizedFn: "function",
  useMutationObserver: "object",
  useOnline: "value",
  usePageVisibility: "value",
  usePagination: "object",
  usePermission: "object",
  useRafLoop: "object",
  useReducedMotion: "value",
  useRequest: "object",
  useScroll: "object",
  useSearch: "object",
  useSelection: "object",
  useSessionStorageState: "object",
  useSetState: "tuple",
  useSortable: "object",
  useTable: "object",
  useTextSelection: "object",
  useThrottleFn: "object",
  useToggle: "object",
  useUndoRedo: "object",
  useUpload: "object",
  useUrlState: "tuple",
  useVirtualList: "object",
  useWindowSize: "object",
} as const satisfies Record<
  HookName,
  "object" | "tuple" | "function" | "void" | "value"
>;

export function describeReturn(name: HookName, api: ApiDoc) {
  const kind = returnKinds[name];
  const fields = [...api.returns, ...(api.methods ?? [])];
  const generic = api.generics?.length
    ? `<${api.generics.map((g) => `${g.name}${g.type === "unknown" ? "" : ` extends ${g.type}`}${g.defaultValue === "无默认类型" ? "" : ` = ${g.defaultValue}`}`).join(", ")}>`
    : "";
  const fieldType = (type: string) =>
    name === "useFieldArray"
      ? type.replace(
          /\bItem\b/g,
          "(FieldValue<T, P> extends readonly (infer I)[] ? I : never)",
        )
      : type;
  let type: string;
  if (kind === "object") {
    const groups = new Map<string, { name: string; type: string }[]>();
    const lines: string[] = [];
    for (const field of fields) {
      const [group, child] = field.name.split(".");
      if (child) {
        const entries = groups.get(group) ?? [];
        entries.push({ name: child, type: fieldType(field.type) });
        groups.set(group, entries);
      } else lines.push(`  ${field.name}: ${fieldType(field.type)};`);
    }
    for (const [group, children] of groups)
      lines.push(
        `  ${group}: {\n${children.map((child) => `    ${child.name}: ${child.type};`).join("\n")}\n  };`,
      );
    type = `{\n${lines.join("\n")}\n}`;
  } else if (kind === "tuple") {
    type = `readonly [\n${fields.map((field) => `  ${field.name.replace(/^\[\d+\]\s*/, "")}: ${field.type},`).join("\n")}\n]`;
  } else type = api.returns[0].type;
  const description =
    kind === "object"
      ? name === "useLatest"
        ? "返回一个引用稳定的 ref 对象。current 是该对象的属性，修改它不会触发渲染。"
        : "返回一个对象。下面的属性和方法均属于同一个返回对象，可以通过 result.属性 / result.方法() 访问，也可以解构使用。"
      : kind === "tuple"
        ? "返回一个只读元组，按位置解构为状态值和更新函数。下面列出元组元素，函数是元组中的一项。"
        : kind === "function"
          ? "直接返回一个可调用函数。下方名称只是示例变量名，不是对象属性；通过该函数传入参数并接收结果。"
          : kind === "void"
            ? "没有返回值（void）。此 Hook 执行副作用，并按其清理策略在卸载时解除订阅或恢复状态。"
            : "直接返回下列类型的值。表中的名称是接收结果的示例变量名，不是返回对象的属性。";
  return {
    kind,
    description,
    type: `type ${name[0].toUpperCase() + name.slice(1)}Result${generic} = ${type};`,
  };
}
