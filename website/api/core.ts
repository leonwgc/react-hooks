import { p, v, options, target, targetType, type ApiDoc } from "./types";
const state = "src/state/index.ts";
const effects = "src/effects/index.ts";
const interaction = "src/interaction/index.ts";
const animation = "src/animation/index.ts";
const setter = (type: string) =>
  `(next: ${type} | ((previous: ${type}) => ${type})) => void`;
const fnParams = [
  p(
    "fn",
    "(...args: Args) => Result",
    "必填",
    "执行时读取最新回调；Args 为参数元组，Result 为回调返回类型。",
  ),
  p(
    "wait",
    "number",
    "300",
    "等待毫秒数，负数按 0 处理。变化时取消待执行调用。",
  ),
];
export const coreDocs = {
  useBoolean: {
    source: state,
    signature: "useBoolean(initial?: boolean)",
    parameters: [
      p("initial", "boolean", "false", "首次渲染的开关状态，后续变化不重置。"),
    ],
    returns: [v("value", "boolean", "当前状态。")],
    methods: [
      v("setValue", setter("boolean"), "直接赋值或函数式更新。"),
      v("toggle", "() => void", "反转当前状态。"),
      v("setTrue", "() => void", "设为 true。"),
      v("setFalse", "() => void", "设为 false。"),
    ],
  },
  useToggle: {
    source: state,
    signature: "useToggle<T>(first: T, second: T)",
    parameters: [
      p("first", "T", "必填", "初始值，同时作为切换的第一个值。"),
      p("second", "T", "必填", "切换的第二个值。"),
    ],
    returns: [v("value", "T", "当前值，初始为 first。")],
    methods: [
      v("setValue", setter("T"), "允许直接设置任意 T 值。"),
      v(
        "toggle",
        "() => void",
        "当前值与 first 按 Object.is 相等时切到 second，否则切到 first；使用最新参数。",
      ),
    ],
  },
  useSetState: {
    source: state,
    signature: "useSetState<T extends object>(initial: T | (() => T))",
    parameters: [
      p(
        "initial",
        "T | (() => T)",
        "必填",
        "初始对象，或仅初始化时调用的函数。",
      ),
    ],
    returns: [v("[0] state", "T", "元组第一项：当前对象。")],
    methods: [
      v(
        "[1] setState",
        "(patch: Partial<T> | ((previous: T) => Partial<T>)) => void",
        "元组第二项：将 patch 浅合并到旧对象；嵌套对象需自行复制。",
      ),
    ],
  },
  useControllableState: {
    source: state,
    signature: "useControllableState<T>(options: ControllableOptions<T>)",
    parameters: [options("ControllableOptions<T>", true)],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "value",
            "T",
            "undefined",
            "非 undefined 时使用受控模式；undefined 不能作为受控值。",
          ),
          p("defaultValue", "T", "必填", "仅作为非受控初始值。"),
          p(
            "onChange",
            "(value: T) => void",
            "undefined",
            "新旧值按 Object.is 不同时通知；受控模式需由父级更新 value。",
          ),
        ],
      },
    ],
    returns: [v("[0] value", "T", "元组第一项：当前受控或内部值。")],
    methods: [
      v(
        "[1] setValue",
        setter("T"),
        "元组第二项：计算新值并通知 onChange；非受控时同时更新内部值。",
      ),
    ],
  },
  useLatest: {
    source: state,
    signature: "useLatest<T>(value: T)",
    parameters: [p("value", "T", "必填", "每次渲染写入 ref.current 的值。")],
    returns: [
      v(
        "ref",
        "{ current: T }",
        "引用稳定的 ref；current 始终对应最近一次渲染值。修改 ref 不会引发渲染。",
      ),
    ],
  },
  useMemoizedFn: {
    source: state,
    signature:
      "useMemoizedFn<Args extends unknown[], Result>(fn: (...args: Args) => Result)",
    parameters: [fnParams[0]],
    returns: [
      v(
        "callback",
        "(...args: Args) => Result",
        "稳定引用；调用时执行最新 fn，并透传参数、返回值及异常，不改变同步/异步语义。",
      ),
    ],
  },
  useDebounce: {
    source: effects,
    signature: "useDebounce<T>(value: T, wait?: number)",
    parameters: [
      p("value", "T", "必填", "需要延迟更新的值；初始返回此值。"),
      fnParams[1],
    ],
    returns: [
      v(
        "debounced",
        "T",
        "连续 wait 毫秒没有变化后更新的值；等待期间保留上一次值。",
      ),
    ],
  },
  useDebounceFn: {
    source: effects,
    signature:
      "useDebounceFn<Args extends unknown[], Result>(fn: (...args: Args) => Result, wait?: number)",
    parameters: fnParams,
    returns: [],
    methods: [
      v(
        "run",
        "(...args: Args) => void",
        "重启尾沿计时，最终只使用最近一次参数；不返回回调结果。",
      ),
      v("cancel", "() => void", "清除定时器和待执行参数。"),
      v(
        "flush",
        "() => Result | undefined",
        "立即执行待处理调用并返回结果；没有待处理调用时返回 undefined。",
      ),
    ],
  },
  useThrottleFn: {
    source: effects,
    signature:
      "useThrottleFn<Args extends unknown[], Result>(fn: (...args: Args) => Result, wait?: number)",
    parameters: fnParams,
    returns: [],
    methods: [
      v(
        "run",
        "(...args: Args) => Result | undefined",
        "首次立即执行并返回结果；窗口内只保留最后参数供尾沿执行，此时返回 undefined。",
      ),
      v(
        "cancel",
        "() => void",
        "清除尾沿任务并重置窗口，下一次 run 可立即执行。",
      ),
      v(
        "flush",
        "() => Result | undefined",
        "有尾沿任务时立即执行并更新窗口起点；无任务返回 undefined。",
      ),
    ],
  },
  useInterval: {
    source: effects,
    signature:
      "useInterval(callback: () => void, delay: number | null, immediate?: boolean)",
    parameters: [
      p(
        "callback",
        "() => void",
        "必填",
        "每轮执行的最新回调；异步工作不会被等待，应自行处理重叠与异常。",
      ),
      p(
        "delay",
        "number | null",
        "必填",
        "毫秒间隔，最小 1；null 暂停并清除定时器。",
      ),
      p(
        "immediate",
        "boolean",
        "false",
        "启用或重新设置间隔时先执行一次；delay 为 null 时不执行。",
      ),
    ],
    returns: [
      v(
        "返回值",
        "void",
        "只管理定时器，不返回控制对象。通过 delay 暂停/恢复。",
      ),
    ],
  },
  useDisclosure: {
    source: interaction,
    signature: "useDisclosure(initial?: boolean)",
    parameters: [p("initial", "boolean", "false", "首次渲染是否打开。")],
    returns: [v("isOpen", "boolean", "当前是否打开。")],
    methods: [
      v("open", "() => void", "打开。"),
      v("close", "() => void", "关闭。"),
      v("toggle", "() => void", "反转开关。"),
    ],
  },
  useEditor: {
    source: interaction,
    signature: "useEditor<T>()",
    parameters: [],
    returns: [
      v("isOpen", "boolean", "面板开关，初始 false。"),
      v("mode", "'create' | 'edit'", "当前操作模式，初始 'create'。"),
      v("record", "T | null", "编辑对象，初始 null；仅保存引用，不复制数据。"),
    ],
    methods: [
      v("create", "() => void", "打开新建面板，清空 record。"),
      v("edit", "(record: T) => void", "保存记录并打开编辑面板。"),
      v("close", "() => void", "关闭面板，保留 mode 和 record。"),
    ],
  },
  useAsyncAction: {
    source: interaction,
    signature:
      "useAsyncAction<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>)",
    parameters: [
      p(
        "action",
        "(...args: Args) => Promise<Result>",
        "必填",
        "异步操作；同步抛出的异常也会转换为 Promise 拒绝。",
      ),
    ],
    returns: [
      v("loading", "boolean", "操作是否进行中，初始 false。"),
      v("error", "unknown", "最近一次失败；新操作开始时清空为 undefined。"),
    ],
    methods: [
      v(
        "run",
        "(...args: Args) => Promise<Result>",
        "进行中重复调用返回同一个 Promise，忽略新参数；失败会拒绝，调用方需 catch。",
      ),
    ],
  },
  useDirty: {
    source: interaction,
    signature: "useDirty<T>(value: T, options?)",
    parameters: [p("value", "T", "必填", "当前不可变数据。"), options()],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "initialValue",
            "T",
            "首次 value",
            "初始比较基准；后续变化不自动更新基准。",
          ),
          p(
            "isEqual",
            "(a: T, b: T) => boolean",
            "内置 equal",
            "比较基准与当前值；相等返回 true。默认支持普通对象、数组、Date 和基本类型。",
          ),
        ],
      },
    ],
    returns: [
      v("isDirty", "boolean", "当前值与基准不相等。"),
      v("baseline", "T", "当前基准引用。"),
    ],
    methods: [
      v(
        "reset",
        "(next?: T) => void",
        "更新基准，省略 next 时使用当前 value；不修改 value。",
      ),
    ],
  },
  usePermission: {
    source: interaction,
    signature: "usePermission(permissions: Iterable<string>)",
    parameters: [
      p(
        "permissions",
        "Iterable<string>",
        "必填",
        "当前权限集合；每次渲染重新读取，精确匹配字符串。",
      ),
    ],
    returns: [],
    methods: [
      v("has", "(permission: string) => boolean", "是否包含指定权限。"),
      v(
        "hasAll",
        "(required: readonly string[]) => boolean",
        "是否拥有全部权限；空数组为 true。",
      ),
      v(
        "hasAny",
        "(required: readonly string[]) => boolean",
        "是否拥有至少一个权限；空数组为 false。",
      ),
    ],
  },
  useReducedMotion: {
    source: animation,
    signature: "useReducedMotion()",
    parameters: [],
    returns: [
      v(
        "reduced",
        "boolean",
        "系统是否匹配 prefers-reduced-motion: reduce；SSR 初始 false。",
      ),
    ],
  },
  useRafLoop: {
    source: animation,
    signature:
      "useRafLoop(callback: (frame: { time: number; delta: number }) => void, autoStart?: boolean)",
    parameters: [
      p(
        "callback",
        "(frame: { time: number; delta: number }) => void",
        "必填",
        "time 为 RAF 时间戳；delta 为距离上一帧的毫秒数，启动后的第一帧为 0。",
      ),
      p("autoStart", "boolean", "true", "挂载自动启动；改为 false 时停止。"),
    ],
    returns: [
      v(
        "running",
        "boolean",
        "当前循环是否启用；初始 false，挂载后根据 autoStart 更新。",
      ),
    ],
    methods: [
      v("start", "() => void", "开始循环；已运行或没有 RAF 时无操作。"),
      v("stop", "() => void", "取消下一帧，清除时间基准，running 变为 false。"),
    ],
  },
  useAnimate: {
    source: animation,
    signature: "useAnimate(target: Target<Element>, options?)",
    parameters: [target(), options()],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "respectReducedMotion",
            "boolean",
            "true",
            "遵循减少动态效果偏好，将时长与延迟归零、次数设为 1。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "status",
        "'idle' | 'running' | 'paused' | 'finished'",
        "动画状态，初始 'idle'。",
      ),
    ],
    methods: [
      v(
        "play",
        "(keyframes: Keyframe[] | PropertyIndexedKeyframes, timing?: number | KeyframeAnimationOptions) => Animation | null",
        "取消旧动画后播放；timing 默认 300ms。目标不存在或不支持 animate 返回 null；原生参数异常直接抛出。",
      ),
      v("pause", "() => void", "暂停当前动画，没有动画时无操作。"),
      v("resume", "() => void", "继续当前动画。"),
      v("reverse", "() => void", "反向播放当前动画。"),
      v("cancel", "() => void", "取消并移除动画效果，恢复 idle。"),
    ],
    types: targetType,
  },
} satisfies Record<string, ApiDoc>;
