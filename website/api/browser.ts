import { p, v, options, target, targetType, type ApiDoc } from "./types";
const source = "src/browser/index.ts";
const size = [
  v("width", "number", "宽度，单位 CSS px；初始 0。"),
  v("height", "number", "高度，单位 CSS px；初始 0。"),
];
const storage = {
  source,
  parameters: [
    p("key", "string", "必填", "存储键；变化时切换监听并读取新键。"),
    p(
      "initial",
      "T",
      "必填",
      "键不存在或读取失败时的值，同时是 SSR 初始值。需可 JSON 序列化。",
    ),
  ],
  returns: [
    v("value", "T", "当前值，挂载后从存储同步。解析 JSON 不等于验证业务类型。"),
    v(
      "error",
      "unknown",
      "最近一次读取、解析或写入错误；成功时清空为 undefined。",
    ),
  ],
  methods: [
    v(
      "setValue",
      "(next: T | ((previous: T) => T)) => void",
      "写入 JSON，函数更新读取存储中的最新值。失败仅记录 error，不抛出。",
    ),
    v(
      "remove",
      "() => void",
      "删除键并恢复最新 initial 值，通知当前文档中的同类 Hook 实例。",
    ),
  ],
};
export const browserDocs = {
  useEventListener: {
    source,
    signature:
      "useEventListener<E extends Event = Event>(type: string, listener: (event: E) => void, target?, options?)",
    parameters: [
      p("type", "string", "必填", "原生 DOM 事件名称，不带 on 前缀。"),
      p(
        "listener",
        "(event: E) => void",
        "必填",
        "使用最新回调；E 仅提供静态类型约束，请与事件名称匹配。",
      ),
      target("EventTarget", true),
      options("AddEventListenerOptions"),
    ],
    sections: [
      {
        title: "options · 原生事件选项",
        rows: [
          p("capture", "boolean", "false", "捕获阶段监听。"),
          p(
            "once",
            "boolean",
            "false",
            "原生监听器触发一次后移除；组件重新提交会重新绑定。",
          ),
          p(
            "passive",
            "boolean",
            "浏览器默认",
            "显式为 true 时不可使用 preventDefault。",
          ),
          p(
            "signal",
            "AbortSignal",
            "undefined",
            "外部取消信号；abort 时浏览器移除监听器。",
          ),
        ],
      },
    ],
    returns: [
      v("返回值", "void", "随 React 提交绑定和清理监听器，无额外控制方法。"),
    ],
    types: targetType,
  },
  useMediaQuery: {
    source,
    signature: "useMediaQuery(query: string, serverValue?: boolean)",
    parameters: [
      p(
        "query",
        "string",
        "必填",
        "传给 matchMedia 的媒体查询，例如 (min-width: 768px)。",
      ),
      p(
        "serverValue",
        "boolean",
        "false",
        "SSR、hydration 初值以及没有 matchMedia 时的回退值。",
      ),
    ],
    returns: [
      v("matches", "boolean", "当前是否匹配，随媒体查询 change 事件更新。"),
    ],
  },
  useWindowSize: {
    source,
    signature: "useWindowSize()",
    parameters: [],
    returns: size,
    notes: ["读取 window.innerWidth / innerHeight；监听 resize。"],
  },
  useElementSize: {
    source,
    signature: "useElementSize(target: Target<Element>)",
    parameters: [target()],
    returns: size,
    types: targetType,
    notes: [
      "从 getBoundingClientRect 读取包含边框的尺寸；没有 ResizeObserver 时仅在 window.resize 重新测量。",
    ],
  },
  useIntersectionObserver: {
    source,
    signature:
      "useIntersectionObserver(target: Target<Element>, options?: IntersectionObserverInit)",
    parameters: [target(), options("IntersectionObserverInit")],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "root",
            "Element | Document | null",
            "null",
            "交叉计算的根容器；null 使用视口。",
          ),
          p(
            "rootMargin",
            "string",
            "'0px'",
            "根容器边界偏移，使用原生 CSS margin 格式。",
          ),
          p(
            "threshold",
            "number | number[]",
            "0",
            "交叉比例阈值，范围 0–1。非法原生配置可能抛错。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "entry",
        "IntersectionObserverEntry | null",
        "最近一次观察结果；初始或 API 不可用为 null。可读取 isIntersecting、intersectionRatio、boundingClientRect 等原生字段。",
      ),
    ],
    types: targetType,
  },
  useScroll: {
    source,
    signature: "useScroll(target?: Target<Element>)",
    parameters: [target("Element", true)],
    returns: [
      v("x", "number", "水平滚动偏移，CSS px；初始 0。"),
      v("y", "number", "垂直滚动偏移，CSS px；初始 0。"),
    ],
    types: targetType,
  },
  useClickOutside: {
    source,
    signature:
      "useClickOutside(target: Target<Element>, callback: (event: PointerEvent) => void, enabled?: boolean)",
    parameters: [
      target(),
      p(
        "callback",
        "(event: PointerEvent) => void",
        "必填",
        "document 的 pointerdown 路径不包含目标节点时触发；不是 click 事件。",
      ),
      p(
        "enabled",
        "boolean",
        "true",
        "false 时保留绑定但不触发回调；目标为空也不触发。",
      ),
    ],
    returns: [v("返回值", "void", "无返回对象，卸载自动清理。")],
    types: targetType,
  },
  useKeyPress: {
    source,
    signature:
      "useKeyPress(keys: string | readonly string[], callback: (event: KeyboardEvent) => void, options?: KeyPressOptions)",
    parameters: [
      p(
        "keys",
        "string | readonly string[]",
        "必填",
        "单键或组合键；数组中任一匹配即可。支持 mod+s、ctrl+shift+plus、space、esc 和字面量 +。",
      ),
      p(
        "callback",
        "(event: KeyboardEvent) => void",
        "必填",
        "匹配 keydown 时触发，使用最新回调；输入法组合期间忽略。",
      ),
      options("KeyPressOptions"),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p("enabled", "boolean", "true", "是否启用当前绑定。"),
          p(
            "allowInInput",
            "boolean",
            "false",
            "是否允许在 input、textarea、select、contenteditable 内触发。",
          ),
          p(
            "target",
            "Target<EventTarget>",
            "window",
            "监听目标；null 不监听。",
          ),
          p(
            "scope",
            "Target<HTMLElement>",
            "undefined",
            "仅事件目标位于该容器内时匹配；省略表示不限制范围。",
          ),
          p(
            "priority",
            "number",
            "0",
            "同一监听目标下数值高者优先，同优先级后注册优先。",
          ),
          p(
            "preventDefault",
            "boolean",
            "false",
            "匹配后阻止默认行为并停止后续 Hook 绑定执行。",
          ),
          p(
            "stopPropagation",
            "boolean",
            "false",
            "匹配后停止事件冒泡并停止后续 Hook 绑定执行。",
          ),
          p("repeat", "boolean", "true", "是否接受长按重复 keydown。"),
          p(
            "platform",
            "'mac' | 'windows'",
            "自动检测",
            "决定 mod 映射为 meta 或 ctrl；可覆盖平台判断。",
          ),
        ],
      },
    ],
    returns: [v("返回值", "void", "只注册快捷键。")],
    types: targetType,
    notes: [
      "组合键严格匹配全部修饰键；单键只比较 event.key，忽略附带修饰键。cmd/control/option 分别是 meta/ctrl/alt 的别名。独占只协调同一目标上的本库绑定，不阻止其他独立监听器。",
    ],
  },
  useClipboard: {
    source,
    signature: "useClipboard()",
    parameters: [],
    returns: [
      v(
        "copied",
        "boolean",
        "最近一次已生效的复制是否成功；初始 false，不自动倒计时复位。",
      ),
      v(
        "error",
        "unknown",
        "最近复制错误；初始 undefined，成功或 reset 时清空。",
      ),
    ],
    methods: [
      v(
        "copy",
        "(text: string) => Promise<boolean>",
        "写入剪贴板；成功 true，失败 false 并记录 error。需安全上下文与浏览器授权。",
      ),
      v(
        "reset",
        "() => void",
        "复位状态并使未完成复制的状态更新失效；不清除系统剪贴板。",
      ),
    ],
  },
  useOnline: {
    source,
    signature: "useOnline()",
    parameters: [],
    returns: [
      v(
        "online",
        "boolean",
        "navigator.onLine 的当前值，SSR 为 true；只反映浏览器联网判断，不保证某个接口可达。",
      ),
    ],
  },
  usePageVisibility: {
    source,
    signature: "usePageVisibility()",
    parameters: [],
    returns: [
      v(
        "visibility",
        "DocumentVisibilityState",
        "'visible' 或 'hidden'；SSR 为 'visible'。监听 visibilitychange。这个状态不等同于窗口焦点。 ",
      ),
    ],
  },
  useCountdown: {
    source,
    signature: "useCountdown(target: number | null, options?)",
    parameters: [
      p(
        "target",
        "number | null",
        "必填",
        "结束时间的 Unix 毫秒时间戳；例如 Date.now() + 60000。null 停止。",
      ),
      options(),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "interval",
            "number",
            "1000",
            "刷新间隔毫秒，最小 16；临近结束时缩短到剩余时长。",
          ),
          p(
            "onEnd",
            "() => void",
            "undefined",
            "到达结束时间时触发，同一个已结束时间戳不重复通知；先设 null 可重置记录。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "remaining",
        "number",
        "剩余毫秒，最小 0，初始 0；每次从目标时间重新计算，非累计减法。",
      ),
      v("seconds", "number", "Math.ceil(remaining / 1000)，向上取整。"),
      v(
        "finished",
        "boolean",
        "target 非 null 且 remaining 为 0；挂载前 remaining 为 0，因此不要以初始 finished 替代 onEnd。",
      ),
    ],
  },
  useLocalStorageState: {
    ...storage,
    signature: "useLocalStorageState<T>(key: string, initial: T)",
    notes: [
      "使用 localStorage；同步本标签页的 Hook 写入和同源其他文档的 storage 事件。直接 localStorage.setItem 不会向当前文档发送 storage 事件。",
    ],
  },
  useSessionStorageState: {
    ...storage,
    signature: "useSessionStorageState<T>(key: string, initial: T)",
    notes: [
      "使用 sessionStorage；按浏览器会话隔离，不提供跨标签页同步。当前文档的同类 Hook 实例会同步。",
    ],
  },
  useUrlState: {
    source,
    signature:
      "useUrlState(initial?: Record<string, string>, mode?: 'replace' | 'push')",
    parameters: [
      p(
        "initial",
        "Record<string, string>",
        "{}",
        "缺少对应 URL 参数时的默认值，同时作为 SSR 初始值。",
      ),
      p(
        "mode",
        "'replace' | 'push'",
        "'replace'",
        "replace 替换当前历史条目；push 增加可后退条目。",
      ),
    ],
    returns: [
      v(
        "[0] state",
        "Record<string, string>",
        "默认值与全部查询参数合并，URL 优先；重复键使用最后一个值，所有值均为字符串。",
      ),
    ],
    methods: [
      v(
        "[1] setState",
        "(patch: Record<string, string | null>) => void",
        "合并写入查询参数；null 删除键，删除后读取可能回退到 initial。保留其他参数、hash 与 history.state；不接收函数更新。",
      ),
    ],
    notes: [
      "监听 popstate 和本库 URL 更新事件。第三方直接 pushState/replaceState 不会自动通知；接入路由器时使用其官方状态接口。",
    ],
  },
} satisfies Record<string, ApiDoc>;
