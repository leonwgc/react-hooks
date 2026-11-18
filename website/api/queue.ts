import { p, v, options, type ApiDoc } from "./types";
const source = "src/web/queue.ts";
const queueMethods = [
  v(
    "cancel",
    "(id: string) => void",
    "取消指定 queued/running 任务；未知或已结束 ID 无操作。任务 Promise 以 AbortError 拒绝。",
  ),
  v("cancelAll", "() => void", "取消全部等待与运行任务。"),
  v("pause", "() => void", "停止启动等待任务，不暂停正在执行的传输。"),
  v("resume", "() => void", "恢复调度，按添加顺序启动等待任务。"),
  v(
    "clear",
    "() => void",
    "删除 success/error/cancelled 记录，保留 queued/running。",
  ),
];
const queueTypes =
  'interface QueueTask<T> {\n  id: string;\n  label: string;\n  status: "queued" | "running" | "success" | "error" | "cancelled";\n  result?: T;\n  error?: unknown;\n}\n// 以下 TaskHandle 是文档中的结构说明名称，不是包导出类型。\ninterface TaskHandle<T> { id: string; promise: Promise<T> }';
export const queueDocs = {
  useAsyncQueue: {
    source: "src/web/queue.ts",
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "unknown",
        description:
          "任务成功结果的类型；所有任务共用该结果类型。options 不包含结果信息，应显式传入，如 useAsyncQueue<string>()；省略时为 unknown。",
      },
    ],
    signature: "useAsyncQueue<T = unknown>(options?: AsyncQueueOptions)",
    parameters: [
      {
        name: "options",
        type: "AsyncQueueOptions",
        defaultValue: "{}",
        description: "配置对象，字段见下表。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "concurrency",
            type: "number",
            defaultValue: "3",
            description:
              "同时执行上限；有限值取整且至少 1，非有限值回退 3。降低上限不取消已启动任务。",
          },
          {
            name: "capacity",
            type: "number",
            defaultValue: "Infinity",
            description:
              "queued（含退避等待）与 running 的合计容量；有限值取整且最少 0。超限 add 返回拒绝的 Promise，错误为 QueueCapacityError，不新增 tasks 记录。",
          },
          {
            name: "priority",
            type: "number",
            defaultValue: "0",
            description:
              "数值越大越先启动，同优先级按添加顺序；仅影响等待任务，不抢占运行任务。非有限值按 0。",
          },
          {
            name: "retry",
            type: "number",
            defaultValue: "0",
            description:
              "普通失败后额外重试次数；有限非负整数。取消与超时不重试。",
          },
          {
            name: "retryDelay",
            type: "number",
            defaultValue: "0",
            description:
              "每次重试前等待毫秒；等待时释放已结束传输的并发槽。负值/非有限值按 0。",
          },
          {
            name: "timeout",
            type: "number",
            defaultValue: "undefined",
            description:
              "每次实际执行的超时毫秒，有限且 > 0 启用；到期以 QueueTimeoutError 拒绝并取消 signal。超时为终态。",
          },
        ],
      },
      {
        title: "add 第三个参数 · taskOptions",
        rows: [
          {
            name: "priority",
            type: "number",
            defaultValue: "继承 options.priority",
            description:
              "数值越大越先启动，同优先级按添加顺序；仅影响等待任务，不抢占运行任务。非有限值按 0。 在添加时快照，可覆盖队列默认值。",
          },
          {
            name: "retry",
            type: "number",
            defaultValue: "继承 options.retry",
            description:
              "普通失败后额外重试次数；有限非负整数。取消与超时不重试。 在添加时快照，可覆盖队列默认值。",
          },
          {
            name: "retryDelay",
            type: "number",
            defaultValue: "继承 options.retryDelay",
            description:
              "每次重试前等待毫秒；等待时释放已结束传输的并发槽。负值/非有限值按 0。 在添加时快照，可覆盖队列默认值。",
          },
          {
            name: "timeout",
            type: "number",
            defaultValue: "继承 options.timeout",
            description:
              "每次实际执行的超时毫秒，有限且 > 0 启用；到期以 QueueTimeoutError 拒绝并取消 signal。超时为终态。 在添加时快照，可覆盖队列默认值。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "tasks",
        type: "QueueTask<T>[]",
        description: "按添加顺序排列的状态快照，初始 []。",
      },
      {
        name: "running",
        type: "number",
        description:
          "状态为 running 的任务数。取消后可能仍有未实际结束的任务占用并发槽，不计入此数。",
      },
      {
        name: "pending",
        type: "number",
        description: "状态为 queued 的任务数。",
      },
      {
        name: "paused",
        type: "boolean",
        description: "调度是否暂停，初始 false。",
      },
    ],
    methods: [
      {
        name: "add",
        type: "(run: (signal: AbortSignal) => Promise<T>, label?: string, taskOptions?: QueueTaskOptions) => TaskHandle<T>",
        description:
          "添加并调度任务；label 默认空字符串。返回 ID 和结果 Promise；重试共享同一 ID/Promise，失败需 catch。",
      },
      {
        name: "cancel",
        type: "(id: string) => void",
        description:
          "取消指定 queued/running 任务；未知或已结束 ID 无操作。任务 Promise 以 AbortError 拒绝。",
      },
      {
        name: "cancelAll",
        type: "() => void",
        description: "取消全部等待与运行任务。",
      },
      {
        name: "pause",
        type: "() => void",
        description: "停止启动等待任务，不暂停正在执行的传输。",
      },
      {
        name: "resume",
        type: "() => void",
        description: "恢复调度；高优先级优先，同优先级按添加顺序。",
      },
      {
        name: "clear",
        type: "() => void",
        description: "删除 success/error/cancelled 记录，保留 queued/running。",
      },
    ],
    types:
      'interface QueueTask<T> {\n  id: string;\n  label: string;\n  status: "queued" | "running" | "success" | "error" | "cancelled";\n  result?: T;\n  error?: unknown;\n  priority?: number; // 当前调度优先级\n  attempts?: number; // 已启动次数，首次为 1\n  retryCount?: number; // 已安排重试次数\n}\n// 以下 TaskHandle 是文档中的结构说明名称，不是包导出类型。\ninterface TaskHandle<T> { id: string; promise: Promise<T> }\ninterface QueueTaskOptions {\n  priority?: number; retry?: number; retryDelay?: number; timeout?: number;\n}\ninterface AsyncQueueOptions extends QueueTaskOptions {\n  concurrency?: number; capacity?: number;\n}\ndeclare class QueueCapacityError extends Error { constructor(); }\ndeclare class QueueTimeoutError extends Error { constructor(timeout: number); timeout: number; }',
    notes: [
      "取消/超时立即拒绝对外 Promise，但不响应 signal 的底层任务在实际结束前仍占并发槽，避免重叠请求。running 仅统计状态为 running 的任务，不含这些已逻辑结束的传输。",
      "普通失败且配置 retry 时自动重试，退避期间 pending 包含该任务；暂停不取消退避计时，但阻止新尝试启动。卸载、cancelAll 会清理重试和超时计时器。",
      "options 中 concurrency 可动态改变，其他默认值在 add 时快照；任务已入队后不随配置变化。重试可能重复写入，写操作需由调用方保证幂等性。",
    ],
  },
  useUpload: {
    source: "src/web/queue.ts",
    generics: [
      {
        name: "T",
        type: "unknown",
        defaultValue: "无默认类型",
        description: "上传成功后服务返回的数据类型。",
      },
    ],
    signature:
      "useUpload<T>(options: {\n  transport: (context: UploadContext) => Promise<T>;\n  concurrency?: number;\n})",
    parameters: [
      {
        name: "options",
        type: "{\n    transport: (context: UploadContext) => Promise<T>;\n    concurrency?: number;\n}",
        defaultValue: "必填",
        description: "配置对象，字段见下表。",
      },
    ],
    sections: [
      {
        title: "options",
        rows: [
          {
            name: "transport",
            type: "(context: UploadContext) => Promise<T>",
            defaultValue: "必填",
            description:
              "自定义上传实现；接收原 File、AbortSignal 和进度上报函数。",
          },
          {
            name: "concurrency",
            type: "number",
            defaultValue: "3",
            description: "并发上限，规则与 useAsyncQueue 一致。",
          },
        ],
      },
      {
        title: "createXHRUploadTransport(options) · 辅助函数",
        rows: [
          {
            name: "url",
            type: "string",
            defaultValue: "必填",
            description: "上传接口 URL。",
          },
          {
            name: "fieldName",
            type: "string",
            defaultValue: "'file'",
            description: "FormData 文件字段名。",
          },
          {
            name: "headers",
            type: "Record<string, string>",
            defaultValue: "{}",
            description: "额外请求头；不要手动设置 multipart Content-Type。",
          },
          {
            name: "withCredentials",
            type: "boolean",
            defaultValue: "false",
            description: "设置 xhr.withCredentials。",
          },
          {
            name: "method",
            type: "string",
            defaultValue: "'POST'",
            description: "HTTP 请求方法。",
          },
        ],
      },
    ],
    returns: [
      {
        name: "uploads",
        type: "(QueueTask<T> & { file: File; progress: number })[]",
        description:
          "每个任务含原文件与进度；progress 为 0–100，成功时 100，不代表业务处理百分比。",
      },
      {
        name: "paused",
        type: "boolean",
        description: "是否暂停启动新上传，初始 false。",
      },
      {
        name: "running",
        type: "number",
        description: "当前 running 上传数，语义同 useAsyncQueue。",
      },
    ],
    methods: [
      {
        name: "add",
        type: "(files: Iterable<File>) => TaskHandle<T>[]",
        description:
          "添加文件集合，返回各任务 ID/Promise；同一个 File 多次添加不会自动去重。",
      },
      {
        name: "retry",
        type: "(id: string) => TaskHandle<T> | undefined",
        description:
          "仅对失败/取消记录用原 File 创建新任务；保留旧记录。未知或其他状态返回 undefined。",
      },
      {
        name: "cancel",
        type: "(id: string) => void",
        description:
          "取消指定 queued/running 任务；未知或已结束 ID 无操作。任务 Promise 以 AbortError 拒绝。",
      },
      {
        name: "cancelAll",
        type: "() => void",
        description: "取消全部等待与运行任务。",
      },
      {
        name: "pause",
        type: "() => void",
        description: "停止启动等待任务，不暂停正在执行的传输。",
      },
      {
        name: "resume",
        type: "() => void",
        description: "恢复调度；高优先级优先，同优先级按添加顺序。",
      },
      {
        name: "clear",
        type: "() => void",
        description:
          "删除已结束上传及其文件引用、进度记录，保留运行和等待任务。",
      },
    ],
    types:
      'interface QueueTask<T> {\n  id: string;\n  label: string;\n  status: "queued" | "running" | "success" | "error" | "cancelled";\n  result?: T;\n  error?: unknown;\n  priority?: number;\n  attempts?: number;\n  retryCount?: number;\n}\n// 以下 TaskHandle 是文档中的结构说明名称，不是包导出类型。\ninterface TaskHandle<T> { id: string; promise: Promise<T> }\n\ninterface UploadContext {\n  file: File;\n  signal: AbortSignal;\n  onProgress(loaded: number, total: number): void;\n}\n// loaded/total 使用同一单位（通常字节）；total > 0 才更新百分比。\n// 工厂返回可直接传入 transport 的函数：\n// (context: UploadContext) => Promise<string>',
    notes: [
      "createXHRUploadTransport 使用 XHR/FormData，2xx 返回原始 responseText，不自动解析 JSON；网络错误、非 2xx、取消都会拒绝。需 JSON 时包一层传输适配器。",
      "上传没有文件类型/大小筛选、断点续传或总进度汇总；调用 add 前按业务校验。浏览器上传进度可能触发 CORS 预检。演示使用本地模拟传输。",
    ],
  },
} satisfies Record<string, ApiDoc>;
