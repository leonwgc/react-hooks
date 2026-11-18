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
    source,
    signature: "useAsyncQueue<T = unknown>(options?)",
    parameters: [options()],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "concurrency",
            "number",
            "3",
            "同时执行上限；有限值取整且至少 1，非有限值回退 3。降低上限不取消已启动任务。",
          ),
        ],
      },
    ],
    returns: [
      v("tasks", "QueueTask<T>[]", "按添加顺序排列的状态快照，初始 []。"),
      v(
        "running",
        "number",
        "状态为 running 的任务数。取消后可能仍有未实际结束的任务占用并发槽，不计入此数。",
      ),
      v("pending", "number", "状态为 queued 的任务数。"),
      v("paused", "boolean", "调度是否暂停，初始 false。"),
    ],
    methods: [
      v(
        "add",
        "(run: (signal: AbortSignal) => Promise<T>, label?: string) => TaskHandle<T>",
        "添加任务并尝试调度，label 默认空字符串。返回 ID 与任务 Promise；失败仍以 error 状态保留。",
      ),
      ...queueMethods,
    ],
    types: queueTypes,
    notes: [
      "取消立即拒绝对外 Promise；不响应 signal 的底层工作在结束前仍占并发槽，避免突破真实并发限制。卸载取消所有任务。",
      "可只读取 tasks 而忽略返回 Promise；如 await promise 仍需自行 catch。任务没有自动重试，重新 add 创建新任务。",
    ],
  },
  useUpload: {
    source,
    signature: "useUpload<T>(options)",
    parameters: [options("object", true)],
    sections: [
      {
        title: "options",
        rows: [
          p(
            "transport",
            "(context: UploadContext) => Promise<T>",
            "必填",
            "自定义上传实现；接收原 File、AbortSignal 和进度上报函数。",
          ),
          p(
            "concurrency",
            "number",
            "3",
            "并发上限，规则与 useAsyncQueue 一致。",
          ),
        ],
      },
      {
        title: "createXHRUploadTransport(options) · 辅助函数",
        rows: [
          p("url", "string", "必填", "上传接口 URL。"),
          p("fieldName", "string", "'file'", "FormData 文件字段名。"),
          p(
            "headers",
            "Record<string, string>",
            "{}",
            "额外请求头；不要手动设置 multipart Content-Type。",
          ),
          p(
            "withCredentials",
            "boolean",
            "false",
            "设置 xhr.withCredentials。",
          ),
          p("method", "string", "'POST'", "HTTP 请求方法。"),
        ],
      },
    ],
    returns: [
      v(
        "uploads",
        "(QueueTask<T> & { file: File; progress: number })[]",
        "每个任务含原文件与进度；progress 为 0–100，成功时 100，不代表业务处理百分比。",
      ),
      v("paused", "boolean", "是否暂停启动新上传，初始 false。"),
      v("running", "number", "当前 running 上传数，语义同 useAsyncQueue。"),
    ],
    methods: [
      v(
        "add",
        "(files: Iterable<File>) => TaskHandle<T>[]",
        "添加文件集合，返回各任务 ID/Promise；同一个 File 多次添加不会自动去重。",
      ),
      v(
        "retry",
        "(id: string) => TaskHandle<T> | undefined",
        "仅对失败/取消记录用原 File 创建新任务；保留旧记录。未知或其他状态返回 undefined。",
      ),
      ...queueMethods.map((row) =>
        row.name === "clear"
          ? v(
              "clear",
              "() => void",
              "删除已结束上传及其文件引用、进度记录，保留运行和等待任务。",
            )
          : row,
      ),
    ],
    types:
      queueTypes +
      "\n\ninterface UploadContext {\n  file: File;\n  signal: AbortSignal;\n  onProgress(loaded: number, total: number): void;\n}\n// loaded/total 使用同一单位（通常字节）；total > 0 才更新百分比。\n// 工厂返回可直接传入 transport 的函数：\n// (context: UploadContext) => Promise<string>",
    notes: [
      "createXHRUploadTransport 使用 XHR/FormData，2xx 返回原始 responseText，不自动解析 JSON；网络错误、非 2xx、取消都会拒绝。需 JSON 时包一层传输适配器。",
      "上传没有文件类型/大小筛选、断点续传或总进度汇总；调用 add 前按业务校验。浏览器上传进度可能触发 CORS 预检。演示使用本地模拟传输。",
    ],
  },
} satisfies Record<string, ApiDoc>;
