import { p, v, options, target, targetType, type ApiDoc } from "./types";
const source = "src/web/browser.ts";
export const webBrowserDocs = {
  useImage: {
    source,
    signature:
      'useImage(\n  src: string | null,\n  options?: {\n    fallback?: string;\n    crossOrigin?: "anonymous" | "use-credentials";\n  },\n)',
    parameters: [
      p("src", "string | null", "必填", "原图 URL；null 或空字符串恢复 idle。"),
      options(
        '{\n    fallback?: string;\n    crossOrigin?: "anonymous" | "use-credentials";\n}',
        false,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "fallback",
            "string",
            "undefined",
            "原图失败后尝试一次的备用 URL；与原图相同时不重复请求。",
          ),
          p(
            "crossOrigin",
            "'anonymous' | 'use-credentials'",
            "undefined",
            "创建 Image 后、赋值 src 前设置跨域模式。",
          ),
        ],
      },
    ],
    returns: [
      v("src", "string | null", "当前尝试的地址，可能是备用图；初始 null。"),
      v(
        "status",
        "'idle' | 'loading' | 'loaded' | 'error'",
        "初始 idle；挂载后开始预加载，最终结果为 loaded 或 error。",
      ),
      v(
        "error",
        "Error | null",
        "最终加载失败错误；初始和新一轮加载时为 null。",
      ),
      v("width", "number", "成功图片的 naturalWidth，其他状态为 0。"),
      v("height", "number", "成功图片的 naturalHeight，其他状态为 0。"),
    ],
    notes: [
      "这是预加载与状态管理 Hook；实际展示仍需使用 <img src={image.src}>。没有控制浏览器图片缓存或保证底层下载取消。",
    ],
  },
  useFullscreen: {
    source,
    signature: "useFullscreen(target: Target<Element>)",
    parameters: [target()],
    returns: [
      v(
        "supported",
        "boolean",
        "挂载后检测标准 Fullscreen API 与 fullscreenEnabled；SSR 初始 false。",
      ),
      v(
        "active",
        "boolean",
        "document.fullscreenElement 是否为当前目标，初始 false。",
      ),
      v("error", "unknown", "最近操作错误，初始 undefined；成功时清空。"),
    ],
    methods: [
      v(
        "enter",
        "() => Promise<boolean>",
        "请求目标全屏；目标为空、不支持或被浏览器拒绝时返回 false 并记录 error。",
      ),
      v(
        "exit",
        "() => Promise<boolean>",
        "仅目标当前处于全屏时退出；其他目标的全屏不会主动退出。成功/无需退出返回 true。",
      ),
      v(
        "toggle",
        "() => Promise<boolean>",
        "根据当前实际全屏元素选择进入或退出。",
      ),
    ],
    types: targetType,
    notes: [
      "通过用户手势调用；active 也随 Esc 或其他外部 fullscreenchange 更新。卸载只解除监听，不自动退出全屏。",
    ],
  },
  useBroadcastChannel: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "发送和接收的消息类型；parse 负责运行时解析与校验。",
      },
    ],
    signature:
      "useBroadcastChannel<T>(\n  name: string | null,\n  parse: (value: unknown) => T,\n)",
    parameters: [
      p(
        "name",
        "string | null",
        "必填",
        "同源频道名称；null 不连接，名称变化关闭旧连接。",
      ),
      p(
        "parse",
        "(value: unknown) => T",
        "必填",
        "验证/转换接收到的结构化消息；异常写入 error，不覆盖上一条有效消息。",
      ),
    ],
    returns: [
      v("supported", "boolean", "挂载后检测 API；初始 false。"),
      v(
        "message",
        "T | undefined",
        "最近一次成功解析的消息；初始 undefined，频道变化清空。",
      ),
      v(
        "error",
        "unknown",
        "连接、发送或解析错误；初始 undefined，成功操作时清空。",
      ),
    ],
    methods: [
      v(
        "postMessage",
        "(value: T) => boolean",
        "向频道发送可结构化克隆的数据；成功 true，未连接/克隆失败时 false 并记录 error。发送实例不会接收自己的消息。",
      ),
    ],
  },
  useEventSource: {
    source,
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "解析后的消息类型；由 parse 的返回值决定。",
      },
    ],
    signature:
      "useEventSource<T>(\n  url: string | null,\n  options: {\n    parse: (data: string) => T;\n    event?: string;\n    withCredentials?: boolean;\n    factory?: (url: string, options: EventSourceInit) => EventSourceConnection;\n  },\n)",
    parameters: [
      p("url", "string | null", "必填", "SSE 地址；null 或空字符串关闭连接。"),
      options(
        "{\n    parse: (data: string) => T;\n    event?: string;\n    withCredentials?: boolean;\n    factory?: (url: string, options: EventSourceInit) => EventSourceConnection;\n}",
        true,
      ),
    ],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "parse",
            "(data: string) => T",
            "必填",
            "将 event.data 字符串解析/验证成业务数据；抛错写入 error。",
          ),
          p("event", "string", "'message'", "要订阅的数据事件名称。"),
          p(
            "withCredentials",
            "boolean",
            "false（原生默认）",
            "是否携带跨域凭据。",
          ),
          p(
            "factory",
            "(url: string, init: EventSourceInit) => EventSourceConnection",
            "原生 EventSource",
            "自定义连接工厂，可用于传输适配或测试；返回 EventTarget 兼容对象。仅改变 factory 引用不会立即重连，调用 reconnect 生效。",
          ),
        ],
      },
    ],
    returns: [
      v(
        "supported",
        "boolean",
        "有自定义 factory 或原生 EventSource 时为 true；挂载前 false。",
      ),
      v(
        "data",
        "T | undefined",
        "最近一次解析成功的数据；连接重建/关闭效果执行时清空。",
      ),
      v(
        "status",
        "'closed' | 'connecting' | 'open'",
        "初始 closed；断线按连接 readyState 进入 closed 或 connecting。",
      ),
      v("error", "unknown", "构造、连接或解析错误；打开/接收成功后清空。"),
    ],
    methods: [
      v(
        "close",
        "() => void",
        "关闭连接并禁用自动建立；之后即使 URL 改变也需 reconnect 恢复。",
      ),
      v("reconnect", "() => void", "重新启用并重建当前 URL 的连接。"),
    ],
    types:
      "interface EventSourceConnection extends EventTarget {\n  readonly readyState: number; // 0 connecting, 1 open, 2 closed\n  close(): void;\n}",
    notes: [
      "原生断线重连由 EventSource 自身处理，不由 Hook 实现退避。原生接口不支持任意请求头；示例使用本地模拟源，真实接入需 SSE 服务和相应 CORS 配置。",
    ],
  },
  useTextSelection: {
    source,
    signature: "useTextSelection(target?: Target<Element>)",
    parameters: [target("Element", true, "整个文档")],
    returns: [
      v("text", "string", "当前选中文字，无有效选区时为空字符串。"),
      v(
        "rect",
        "{ x: number; y: number; width: number; height: number } | null",
        "选区包围盒，单位 CSS px、相对视口；无选区为 null。",
      ),
    ],
    methods: [
      v("clear", "() => void", "清除整个文档的原生选区并复位本 Hook 状态。"),
    ],
    types: targetType,
    notes: [
      "指定目标时，选区锚点和焦点都必须位于容器内；target 为 null 时没有有效选区。input/textarea 的 selectionStart/selectionEnd 不在此 API 范围内。",
    ],
  },
  useDownload: {
    source,
    signature: "useDownload()",
    parameters: [],
    returns: [
      v(
        "loading",
        "boolean",
        "请求和触发浏览器保存是否进行中，初始 false；不是磁盘下载进度。",
      ),
      v(
        "error",
        "unknown",
        "当前有效下载的失败，初始 undefined，新下载开始清空。",
      ),
    ],
    methods: [
      v(
        "download",
        '(input: string | Blob, filename: string, init?: Omit<RequestInit, "signal">) => Promise<Blob>',
        "URL 使用 fetch，Blob 直接触发保存；filename 为建议文件名，init 为可选 fetch 配置。返回 Blob，非 2xx、网络错误或过期结果会拒绝。",
      ),
      v(
        "cancel",
        "() => void",
        "中止当前请求并阻止过期结果保存，保留原 error；已交给浏览器的保存不能撤回。",
      ),
    ],
    notes: [
      "每次 download 先取消上一轮，只保存最新结果。由 Hook 管理 signal；URL 需满足 CORS，Blob URL 约 1 秒后释放，卸载清理所有 URL。调用方 await 时必须处理拒绝；完成仅表示触发保存，不保证磁盘写入完成。",
    ],
  },
} satisfies Record<string, ApiDoc>;
