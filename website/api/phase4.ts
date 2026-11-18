import { targetType, type ApiDoc } from "./types";
export const phase4Docs = {
  useQuery: {
    source: "src/data/query.ts",
    signature:
      "useQuery<T, Key extends string>(store: QueryStore<T, Key>, key: Key | null, options?: { enabled?: boolean })",
    typeExample: `import { createQueryStore, useQuery } from "@leonwgc/react-hooks";
type Article = { id: string; title: string };
// 浏览器应用可在模块级共享；SSR 必须为每个请求单独创建。
const articles = createQueryStore<Article[], "recent" | "popular">(
  async ({ signal }, key) => {
    const response = await fetch("/api/articles?sort=" + key, { signal });
    if (!response.ok) throw new Error("查询失败");
    return response.json();
  },
  { staleTime: 30_000, cacheTime: 300_000 },
);
function ArticleList() {
  const query = useQuery(articles, "recent"); // data: Article[] | undefined
  return <span>{query.data?.length ?? 0}</span>;
}`,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "同一个 store 内每个查询结果的数据类型。",
      },
      {
        name: "Key",
        type: "string",
        defaultValue: "无默认类型",
        description:
          "缓存键类型；可使用字符串字面量联合；参数组合需由调用者生成稳定键。",
      },
    ],
    parameters: [
      {
        name: "store",
        type: "QueryStore<T, Key>",
        defaultValue: "必填",
        description:
          "由 createQueryStore(service, options?) 创建；保持引用稳定。",
      },
      {
        name: "key",
        type: "Key | null",
        defaultValue: "必填",
        description: "相同 store 和键共享结果；null 不订阅、不自动请求。",
      },
      {
        name: "options",
        type: "{ enabled?: boolean }",
        defaultValue: "{}",
        description:
          "enabled 默认 true；false 仍订阅缓存，但不自动获取或响应失效刷新。",
      },
    ],
    sections: [
      {
        title: "createQueryStore 参数",
        rows: [
          {
            name: "service",
            type: "(context: { signal: AbortSignal }, key: Key) => Promise<T>",
            defaultValue: "必填",
            description: "键变化时对应不同缓存项，实际请求应透传 signal。",
          },
        ],
      },
      {
        title: "createQueryStore options",
        rows: [
          {
            name: "staleTime",
            type: "number",
            defaultValue: "30000",
            description:
              "新订阅在此毫秒内复用成功数据；到期本身不触发定时刷新；Infinity 表示不过期。",
          },
          {
            name: "cacheTime",
            type: "number",
            defaultValue: "300000",
            description:
              "无人订阅时保留缓存的毫秒数；到期取消请求并回收。Infinity 禁止自动回收。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "data",
        type: "T | undefined",
        description: "当前键的缓存数据；后台刷新时保留旧数据。",
      },
      {
        name: "error",
        type: "unknown",
        description: "最近一次请求失败；新请求或 setData 清空。",
      },
      {
        name: "status",
        type: "'idle' | 'pending' | 'success' | 'error'",
        description: "当前缓存状态；刷新已有数据时状态不强制变为 pending。",
      },
      {
        name: "isFetching",
        type: "boolean",
        description: "当前键是否正在获取或刷新。",
      },
      {
        name: "updatedAt",
        type: "number",
        description: "最后成功写入时间戳（毫秒），初始为 0。",
      },
    ],
    methods: [
      {
        name: "refetch",
        type: "() => Promise<T>",
        description:
          "强制刷新；同键进行中的请求仍共享 Promise。失败需 catch，null 键时拒绝。",
      },
      {
        name: "invalidate",
        type: "() => void",
        description: "标记当前键过期并取消旧请求；存在启用的订阅者时立即重取。",
      },
      {
        name: "setData",
        type: "(value: T | ((previous: T | undefined) => T)) => void",
        description: "取消当前键请求并同步更新所有订阅者；不自动提交服务器。",
      },
      {
        name: "cancel",
        type: "() => void",
        description: "取消共享键的请求，保留已有数据；会影响同键的其他订阅者。",
      },
    ],
    types:
      "// QueryStore、QueryState 和 createQueryStore 均从包入口导出。\ninterface QueryStore<T, Key extends string = string> {\n  fetch(key: Key, force?: boolean): Promise<T>;\n  invalidate(key?: Key): void; // 不传 key 时失效全部已有键\n  setData(key: Key, value: T | ((previous: T | undefined) => T)): void;\n  cancel(key: Key): void;\n  clear(): void; // 清空缓存，不主动重新请求\n  subscribe(key: Key, listener: () => void, enabled?: boolean): () => void;\n  getSnapshot(key: Key): QueryState<T>;\n  getServerSnapshot(): QueryState<T>;\n}\ninterface QueryState<T> {\n  data: T | undefined;\n  error: unknown;\n  status: 'idle' | 'pending' | 'success' | 'error';\n  isFetching: boolean;\n  updatedAt: number;\n}",
    notes: [
      "同键须代表同一组服务参数。createQueryStore 的 service 在创建时确定；不要让它捕获会变化但未编码进 key 的组件状态。",
      "卸载一个订阅者不会取消其他组件共用的请求；无人订阅后仍可完成并写缓存，最终按 cacheTime 回收。",
      "SSR 不会自动请求；每个服务端请求创建自己的 store，禁止把用户缓存放在共享服务端单例。本版不含持久化、脱水注水、焦点刷新或重试；这些能力不隐式继承 useRequest。",
    ],
  },
  useSteps: {
    source: "src/form/steps.ts",
    signature: "useSteps(options: StepsOptions)",
    parameters: [
      {
        name: "options",
        type: "StepsOptions",
        defaultValue: "必填",
        description: "步骤流配置。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "count",
            type: "number",
            defaultValue: "必填",
            description: "总步数，有限值向下取整且最少为 1。",
          },
          {
            name: "initialStep",
            type: "number",
            defaultValue: "0",
            description: "从 0 开始的初始步骤；超出范围会截断。",
          },
          {
            name: "validate",
            type: "(context: { from: number; to: number; signal: AbortSignal }) => boolean | Promise<boolean>",
            defaultValue: "undefined",
            description:
              "只校验向前移动的当前步骤；true 才切换，false 保持原步骤，异常写入 error。跨步跳转不会逐步校验中间步骤。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "step",
        type: "number",
        description: "当前步骤索引。",
      },
      {
        name: "count",
        type: "number",
        description: "规范化后的总步数。",
      },
      {
        name: "completed",
        type: "number[]",
        description: "成功向前离开的步骤，去重并升序排列。",
      },
      {
        name: "isFirst",
        type: "boolean",
        description: "是否位于第一步。",
      },
      {
        name: "isLast",
        type: "boolean",
        description: "是否位于最后一步。",
      },
      {
        name: "validating",
        type: "boolean",
        description: "是否等待当前向前移动的校验。",
      },
      {
        name: "error",
        type: "unknown",
        description: "当前有效校验的异常；新操作或 reset 清空。",
      },
    ],
    methods: [
      {
        name: "goTo",
        type: "(target: number) => Promise<boolean>",
        description:
          "跳到目标步骤；成功移动返回 true，校验失败、原地操作或过期操作返回 false。",
      },
      {
        name: "next",
        type: "() => Promise<boolean>",
        description: "前进一步并按需校验。",
      },
      {
        name: "previous",
        type: "() => Promise<boolean>",
        description: "后退一步，不触发前进校验。",
      },
      {
        name: "reset",
        type: "(target?: number) => void",
        description:
          "取消校验，清空完成记录和错误，返回 initialStep 或指定步骤。",
      },
      {
        name: "cancel",
        type: "() => void",
        description: "取消等待中的校验，保留当前步骤和完成记录。",
      },
    ],
    notes: [
      "后发操作、reset、count 变化或卸载使旧校验失效。validate 应响应 signal；忽略 signal 的 Promise 仍可能继续执行，但不会修改步骤。",
      "步骤文案和字段归属由调用方管理；返回的是导航状态，不自动提交表单。",
    ],
  },
  useDocumentTitle: {
    source: "src/browser/document.ts",
    signature:
      "useDocumentTitle(title: string, options?: { restoreOnUnmount?: boolean })",
    parameters: [
      {
        name: "title",
        type: "string",
        defaultValue: "必填",
        description: "要显示在浏览器标签上的标题，变化后同步更新。",
      },
      {
        name: "options",
        type: "{ restoreOnUnmount?: boolean }",
        defaultValue: "{}",
        description: "卸载恢复策略。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "restoreOnUnmount",
            type: "boolean",
            defaultValue: "true",
            description:
              "最后一个标题拥有者卸载时恢复最初标题；false 保留最终标题。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "返回值",
        type: "void",
        description: "直接同步 document.title，没有返回值。",
      },
    ],
    notes: [
      "多个实例按副作用注册顺序由最后注册者控制；卸载后恢复仍存在的拥有者。更新较早实例的标题不会抢占较晚实例。",
      "如果其他代码直接更改了标题，清理时不会覆盖该外部修改。SSR 不访问 document，也不替代框架的服务端 head 管理。",
    ],
  },
  useObjectURL: {
    source: "src/browser/document.ts",
    signature: "useObjectURL(input: Blob | null)",
    parameters: [
      {
        name: "input",
        type: "Blob | null",
        defaultValue: "必填",
        description:
          "File 也是 Blob；null 清空预览。保持同一 Blob 引用可复用 URL。",
      },
    ],
    returns: [
      {
        name: "url",
        type: "string | null",
        description:
          "创建成功后的对象 URL；更换 input 时立即隐藏旧 URL，挂载后创建。",
      },
      {
        name: "error",
        type: "unknown",
        description: "创建 URL 时的异常，无错误时为 undefined。",
      },
      {
        name: "supported",
        type: "boolean",
        description: "当前环境是否同时支持创建与回收对象 URL；SSR 为 false。",
      },
    ],
    notes: [
      "更换 Blob、传入 null 或卸载时自动 revokeObjectURL。不要将 URL 持久化，也不要在 Hook 已卸载后继续使用。",
      "Blob URL 只代表本地资源地址，不会自动上传文件或下载文件。",
    ],
  },
  useTextareaAutoSize: {
    source: "src/browser/document.ts",
    signature:
      "useTextareaAutoSize(target: Target<HTMLTextAreaElement>, value: string, options?: { minRows?: number; maxRows?: number; enabled?: boolean })",
    parameters: [
      {
        name: "target",
        type: "Target<HTMLTextAreaElement>",
        defaultValue: "必填",
        description: "textarea 节点、ref、返回节点的函数或 null。",
      },
      {
        name: "value",
        type: "string",
        defaultValue: "必填",
        description:
          "文本域当前值；受控输入更新后重新测量，实际高度来自元素 scrollHeight。",
      },
      {
        name: "options",
        type: "{ minRows?: number; maxRows?: number; enabled?: boolean }",
        defaultValue: "{}",
        description: "行数边界与启停。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "minRows",
            type: "number",
            defaultValue: "1",
            description: "最少行数，不小于 1。",
          },
          {
            name: "maxRows",
            type: "number",
            defaultValue: "Infinity",
            description: "最多行数，不小于 minRows；超出时启用内部滚动。",
          },
          {
            name: "enabled",
            type: "boolean",
            defaultValue: "true",
            description: "false 时解除监听并恢复原内联样式。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "height",
        type: "number",
        description: "最近测量后应用的 CSS 高度 px；未绑定或禁用时为 0。",
      },
    ],
    methods: [
      {
        name: "resize",
        type: "() => void",
        description: "手动重测，适合字体加载或外部样式变化。",
      },
    ],
    types: targetType,
    notes: [
      "监听输入、窗口 resize 和元素宽度变化，支持 content-box 和 border-box；卸载或换节点时恢复原 height/overflowY。",
      "应让 CSS line-height 为明确数值；normal 使用 font-size × 1.2 估算。隐藏元素的几何值可能为 0，显示后请调用 resize。",
    ],
  },
  useSpring: {
    source: "src/animation/motion.ts",
    signature: "useSpring(target: number, options?: SpringOptions)",
    parameters: [
      {
        name: "target",
        type: "number",
        defaultValue: "必填",
        description: "有限目标值；NaN 或 Infinity 抛出 RangeError。",
      },
      {
        name: "options",
        type: "SpringOptions",
        defaultValue: "{}",
        description: "弹簧物理参数和初值。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "initialValue",
            type: "number",
            defaultValue: "target",
            description: "仅首次初始化使用；提供不同值可触发首次动画。",
          },
          {
            name: "stiffness",
            type: "number",
            defaultValue: "170",
            description: "正数刚度，越大响应越快。",
          },
          {
            name: "damping",
            type: "number",
            defaultValue: "26",
            description: "正数阻尼，影响回弹与收敛。",
          },
          {
            name: "mass",
            type: "number",
            defaultValue: "1",
            description: "正数质量。",
          },
          {
            name: "precision",
            type: "number",
            defaultValue: "0.01",
            description: "位移误差与速度都低于阈值时精确吸附目标。",
          },
          {
            name: "respectReducedMotion",
            type: "boolean",
            defaultValue: "true",
            description: "默认按系统减少动态效果设置直接吸附。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "value",
        type: "number",
        description: "当前插值，可用于样式或数字展示。",
      },
      {
        name: "velocity",
        type: "number",
        description: "当前速度，单位为值/秒。",
      },
      {
        name: "animating",
        type: "boolean",
        description: "是否仍在进行逐帧计算。",
      },
    ],
    methods: [
      {
        name: "stop",
        type: "() => void",
        description: "暂停在当前位置并将速度清零。",
      },
      {
        name: "finish",
        type: "() => void",
        description: "立即到达最新 target。",
      },
      {
        name: "restart",
        type: "() => void",
        description: "从当前位置重新向最新 target 运动。",
      },
    ],
    notes: [
      "采用阻尼弹簧解析解，帧间隔最多按 64ms 推进；后台恢复时不会按全部离开时间跳跃。",
      "目标改变时沿用当前值和速度，参数改变会重新调度。无 RAF 时直接到达目标，卸载取消待执行帧。正数参数无效时使用默认值。",
    ],
  },
  useTransitionState: {
    source: "src/animation/motion.ts",
    signature:
      "useTransitionState(open: boolean, options?: { enterDuration?: number; exitDuration?: number; appear?: boolean })",
    parameters: [
      {
        name: "open",
        type: "boolean",
        defaultValue: "必填",
        description: "期望的展开状态。",
      },
      {
        name: "options",
        type: "{ enterDuration?: number; exitDuration?: number; appear?: boolean }",
        defaultValue: "{}",
        description: "进入、退出时长与首次进入策略。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "enterDuration",
            type: "number",
            defaultValue: "200",
            description: "进入阶段时长 ms，负数按 0。",
          },
          {
            name: "exitDuration",
            type: "number",
            defaultValue: "200",
            description: "退出阶段保留挂载的时长 ms，负数按 0。",
          },
          {
            name: "appear",
            type: "boolean",
            defaultValue: "false",
            description: "首次 open 为 true 时是否也经历 entering。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "phase",
        type: "TransitionPhase",
        description: "生命周期阶段；快速反向切换会清除旧计时器。",
      },
      {
        name: "mounted",
        type: "boolean",
        description: "除 unmounted 外均为 true；用此值决定是否渲染内容。",
      },
      {
        name: "visible",
        type: "boolean",
        description: "与期望 open 一致，退出阶段为 false。",
      },
    ],
    types:
      "type TransitionPhase = 'unmounted' | 'entering' | 'entered' | 'exiting';",
    notes: [
      "本 Hook 管理挂载时序，不自动添加 CSS 动画。将 phase 映射到类名或样式，并让 CSS 时长与配置一致。",
      "系统要求减少动态效果时立即完成阶段切换。修改时长会重新计时；卸载清理所有计时器。",
    ],
  },
  useGesture: {
    source: "src/web/gesture.ts",
    signature: "useGesture(options?: GestureOptions)",
    parameters: [
      {
        name: "options",
        type: "GestureOptions",
        defaultValue: "{}",
        description: "单指针手势配置与生命周期回调。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "axis",
            type: "'both' | 'x' | 'y'",
            defaultValue: "'both'",
            description: "限制输出位移轴；bind.style 按方向设置 touchAction。",
          },
          {
            name: "threshold",
            type: "number",
            defaultValue: "8",
            description: "进入拖动态的累计距离 px。",
          },
          {
            name: "swipeDistance",
            type: "number",
            defaultValue: "40",
            description:
              "结束时识别滑动方向的最小累计距离 px，不小于 threshold。",
          },
          {
            name: "disabled",
            type: "boolean",
            defaultValue: "false",
            description: "禁用新手势并取消正在进行的手势。",
          },
          {
            name: "onStart",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "主指针按下时调用。",
          },
          {
            name: "onMove",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "有效指针移动时调用。",
          },
          {
            name: "onEnd",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description: "正常松开时调用，可读取 swipe。",
          },
          {
            name: "onCancel",
            type: "(state: GestureState) => void",
            defaultValue: "undefined",
            description:
              "pointercancel、失去捕获、窗口失焦、禁用或 cancel 时调用。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "active",
        type: "boolean",
        description: "是否按下有效主指针。",
      },
      {
        name: "dragging",
        type: "boolean",
        description: "按住且已超过 threshold；结束后为 false。",
      },
      {
        name: "offset",
        type: "{ x: number; y: number }",
        description: "自按下位置开始的累计位移 px。",
      },
      {
        name: "velocity",
        type: "{ x: number; y: number }",
        description: "最近采样速度 px/ms；停止移动超过 80ms 后结束采样会归零。",
      },
      {
        name: "direction",
        type: "GestureDirection | null",
        description: "累计位移的主方向。",
      },
      {
        name: "swipe",
        type: "GestureDirection | null",
        description: "正常松开且达到距离阈值时的方向；按下或取消时清空。",
      },
      {
        name: "bind",
        type: "GestureBindings",
        description:
          "展开到 HTMLElement；保留返回的 style.touchAction 以协调原生滚动。",
      },
    ],
    methods: [
      {
        name: "cancel",
        type: "() => void",
        description: "取消当前手势并释放捕获，保留最后位移。",
      },
      {
        name: "reset",
        type: "() => void",
        description: "取消后恢复全部初始状态。",
      },
    ],
    types:
      "type GestureDirection = 'left' | 'right' | 'up' | 'down';\ninterface GestureState {\n  active: boolean; dragging: boolean;\n  offset: { x: number; y: number };\n  velocity: { x: number; y: number };\n  direction: GestureDirection | null;\n  swipe: GestureDirection | null;\n}\n// GestureBindings 为本文结构说明名称，不是包导出类型。\ninterface GestureBindings {\n  onPointerDown(event: React.PointerEvent<HTMLElement>): void;\n  onPointerMove(event: React.PointerEvent<HTMLElement>): void;\n  onPointerUp(event: React.PointerEvent<HTMLElement>): void;\n  onPointerCancel(event: React.PointerEvent<HTMLElement>): void;\n  onLostPointerCapture(event: React.PointerEvent<HTMLElement>): void;\n  style: React.CSSProperties;\n}",
    notes: [
      "只接收主指针及鼠标左键；额外指针被忽略，不包含双指缩放。卸载释放指针捕获。",
      "bind 不提供键盘拖动或排序，业务操作应提供按钮等键盘等价入口。useDrag/useDrop 对应 HTML 数据拖放，本 Hook 对应指针位移。",
    ],
  },
} satisfies Record<string, ApiDoc>;
